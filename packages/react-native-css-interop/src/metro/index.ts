import fs from "fs";
import fsPromise from "fs/promises";
import path from "path";

import connect from "connect";
import { debug as debugFn, Debugger } from "debug";
import type { MetroConfig } from "metro-config";
import type { FileSystem } from "metro-file-map";
import type MetroServer from "metro/src/Server";

import { cssToReactNativeRuntime } from "../css-to-rn";
import { CssToReactNativeRuntimeOptions } from "../types";
import { expoColorSchemeWarning } from "./expo";

/**
 * Injects the CSS into the React Native runtime.
 *
 * Web:
 *  @expo/metro-config provides all the code needed to handle .css files
 *  This is why we can only support Expo for web projects for the time being
 *  The user will import their .css file, we need to catch this in the resolution
 *  and replace it either with the virtual module (development) or the Tailwind output (production)
 *
 * Native:
 *  When the user imports their .css file, we need to swap it out for a JavaScript file
 *  that injects the global styles. In development we swap to a virtual module and in production we
 *  swap to a .js file generated in the node_modules
 *
 * ------------------
 * Notes
 * ------------------
 *
 * - The virtual module setup requires the development server, so when its turned off we need to write styles to disk
 * - Metro has two run modes, normal (with a server) and headless. In headless mode the `enhancedMiddleware` is not called.
 *   THIS DOES NOT MEAN THAT FAST-REFRESH IS NOT ENABLED! It just means you are making a build that CAN connect to an instance
 *   of Metro that is running a server. E.g `eas` may do a development build that you download and connect to your local server
 * - You can also do production builds WITH Fast Refresh `npx expo run:android --variant production` will start a production
 *   like build, but still enable the dev server for fast refresh.
 * - RadonIDE doesn't use the virtual module setup, it writes the style changes to disk
 * - expo-updates starts its own Metro server with weird timing issues that we cannot resolve. This is why we always write to disk in production.
 *
 * ------------------
 * Different build types
 * ------------------
 * Each of these commands will trigger a different build type.
 *
 *  - `expo start`
 *  - `expo run <platform> --variant production|development`
 *  - `expo export`
 *  - `eas build (without expo-updates)`
 *  - `eas build (with expo-updates)`
 *  - `react-native run`
 *  - `react-native build`
 *  - `npx expo prebuild & building in xcode (development)`
 *  - `npx expo prebuild & building in xcode (production)`
 */

export type WithCssInteropOptions = CssToReactNativeRuntimeOptions & {
  input: string;
  /** Force load styles from the filesystem, used to test production style loading. Disables Fast Refresh of styles. */
  forceWriteFileSystem?: boolean;
  getCSSForPlatform: GetCSSForPlatform;
  parent?: {
    name: string;
    debug: string;
  };
};

export type GetCSSForPlatform = (
  platform: string,
  onChange?: GetCSSForPlatformOnChange,
) => Promise<string | Buffer>;

export type GetCSSForPlatformOnChange = (platform: string) => void;

let haste: any;
let virtualModulesPossible: undefined | Promise<void> = undefined;
const virtualModules = new Map<string, Promise<string | Buffer>>();
const outputDirectory = path.resolve(__dirname, "../../.cache");
const isRadonIDE = "REACT_NATIVE_IDE_LIB_PATH" in process.env;

export function withCssInterop(
  config: MetroConfig,
  options: WithCssInteropOptions,
): MetroConfig;
export function withCssInterop(
  config: () => Promise<MetroConfig>,
  options: WithCssInteropOptions,
): () => Promise<MetroConfig>;
export function withCssInterop(
  config: MetroConfig | (() => Promise<MetroConfig>),
  options: WithCssInteropOptions,
) {
  return typeof config === "function"
    ? async function WithCSSInterop() {
        return getConfig(await config(), options);
      }
    : getConfig(config, options);
}

function getConfig(
  config: MetroConfig,
  options: WithCssInteropOptions,
): MetroConfig {
  const debug = debugFn(options.parent?.name || "react-native-css-interop");
  debug("withCssInterop");
  debug(`outputDirectory ${outputDirectory}`);
  debug(`isRadonIDE: ${isRadonIDE}`);

  expoColorSchemeWarning();

  const originalResolver = config.resolver?.resolveRequest;
  const originalGetTransformOptions = config.transformer?.getTransformOptions;
  const originalMiddleware = config.server?.enhanceMiddleware;

  // Used by the resolverPoisonPill
  const poisonPillPath = "./interop-poison.pill";

  fs.mkdirSync(outputDirectory, { recursive: true });
  fs.writeFileSync(platformPath("ios"), "");
  fs.writeFileSync(platformPath("android"), "");
  fs.writeFileSync(platformPath("native"), "");
  fs.writeFileSync(platformPath("macos"), "");
  fs.writeFileSync(platformPath("windows"), "");

  return {
    ...config,
    transformerPath: require.resolve("./transformer"),
    transformer: {
      ...config.transformer,
      ...{
        cssInterop_transformerPath: config.transformerPath,
        cssInterop_outputDirectory: path.relative(
          process.cwd(),
          outputDirectory,
        ),
      },
      async getTransformOptions(
        entryPoints,
        transformOptions,
        getDependenciesOf,
      ) {
        debug(`getTransformOptions.dev ${transformOptions.dev}`);
        debug(`getTransformOptions.platform ${transformOptions.platform}`);
        debug(
          `getTransformOptions.virtualModulesPossible ${Boolean(virtualModulesPossible)}`,
        );

        const platform = transformOptions.platform || "native";
        const filePath = platformPath(platform);

        if (virtualModulesPossible) {
          await virtualModulesPossible;
          await startCSSProcessor(
            filePath,
            platform,
            transformOptions.dev,
            options,
            debug,
          );
        }

        // We need to write to the file system if virtual modules are not possible and/or we are building for production
        const writeToFileSystem =
          !virtualModulesPossible || !transformOptions.dev;

        debug(`getTransformOptions.writeToFileSystem ${writeToFileSystem}`);

        if (writeToFileSystem) {
          debug(`getTransformOptions.output ${filePath}`);

          // Radon IDE needs to watch the file system for changes, so we need to write the file
          const watchFn = isRadonIDE
            ? async (css: string) => {
                const output =
                  platform === "web"
                    ? css.toString()
                    : getNativeJS(
                        cssToReactNativeRuntime(css, options, debug),
                        debug,
                      );

                await fsPromise.writeFile(filePath, output);
              }
            : undefined;

          const css = await options.getCSSForPlatform(platform, watchFn);

          const output =
            platform === "web"
              ? css.toString("utf-8")
              : getNativeJS(
                  cssToReactNativeRuntime(css, options, debug),
                  debug,
                );

          await fsPromise.mkdir(outputDirectory, { recursive: true });
          await fsPromise.writeFile(filePath, output);
          if (platform !== "web") {
            await fsPromise.writeFile(filePath.replace(/\.js$/, ".map"), "");
          }

          debug(`getTransformOptions.finished`);
        }

        return Object.assign(
          {},
          await originalGetTransformOptions?.(
            entryPoints,
            transformOptions,
            getDependenciesOf,
          ),
        );
      },
    },
    server: {
      ...config.server,
      enhanceMiddleware: (middleware, metroServer) => {
        debug(`enhanceMiddleware.setup`);
        const server = connect();
        const bundler = metroServer.getBundler().getBundler();

        if (options.forceWriteFileSystem) {
          debug(`forceWriteFileSystem true`);
        } else {
          if (!isRadonIDE) {
            virtualModulesPossible = bundler
              .getDependencyGraph()
              .then(async (graph: any) => {
                haste = graph._haste;
                ensureFileSystemPatched(graph._fileSystem);
                ensureBundlerPatched(bundler);
              });

            server.use(async (_, __, next) => {
              // Wait until the bundler patching has completed
              await virtualModulesPossible;
              next();
            });
          }
        }

        return originalMiddleware
          ? server.use(originalMiddleware(middleware, metroServer))
          : server.use(middleware);
      },
    },
    resolver: {
      ...config.resolver,
      sourceExts: [...(config?.resolver?.sourceExts || []), "css"],
      resolveRequest: (context, moduleName, platform) => {
        if (moduleName === poisonPillPath) {
          return { type: "empty" };
        }

        const resolver = originalResolver ?? context.resolveRequest;
        const resolved = resolver(context, moduleName, platform);

        // We only care about the input file, ignore everything else
        if (!("filePath" in resolved && resolved.filePath === options.input)) {
          return resolved;
        }

        platform = platform || "native";

        // Generate a fake name for our virtual module. Make it platform specific
        const filePath = platformPath(platform);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const development = (context as any).isDev || (context as any).dev;
        const isWebProduction = !development && platform === "web";

        debug(`resolveRequest.input ${resolved.filePath}`);
        debug(`resolveRequest.resolvedTo: ${filePath}`);
        debug(`resolveRequest.development: ${development}`);
        debug(`resolveRequest.platform: ${platform}`);

        if (virtualModulesPossible && !isWebProduction) {
          startCSSProcessor(filePath, platform, development, options, debug);
        }

        return {
          ...resolved,
          filePath,
        };
      },
    },
  };
}

async function startCSSProcessor(
  filePath: string,
  platform: string,
  isDev: boolean,
  { input, getCSSForPlatform, ...options }: WithCssInteropOptions,
  debug: Debugger,
) {
  // Ensure that we only start the processor once per file
  if (virtualModules.has(filePath)) {
    return;
  }

  debug(`virtualModules ${filePath}`);
  debug(`virtualModules.isDev ${isDev}`);
  debug(`virtualModules.size ${virtualModules.size}`);

  options = {
    cache: {
      keyframes: new Map(),
      rules: new Map(),
      rootVariables: {},
      universalVariables: {},
    },
    ...options,
  };

  if (!isDev) {
    debug(`virtualModules.fastRefresh disabled`);
    virtualModules.set(
      filePath,
      getCSSForPlatform(platform).then((css) => {
        return platform === "web"
          ? css
          : getNativeJS(cssToReactNativeRuntime(css, options), debug);
      }),
    );
  } else {
    debug(`virtualModules.fastRefresh enabled`);
    virtualModules.set(
      filePath,
      getCSSForPlatform(platform, (css: string) => {
        debug(`virtualStyles.update ${platform}`);
        // Override the virtual module with the new update
        virtualModules.set(
          filePath,
          Promise.resolve(
            platform === "web"
              ? css
              : getNativeJS(cssToReactNativeRuntime(css, options), debug),
          ),
        );

        debug(`virtualStyles.emit ${platform}`);
        haste.emit("change", {
          eventsQueue: [
            {
              filePath,
              metadata: {
                modifiedTime: Date.now(),
                size: 1, // Can be anything
                type: "virtual", // Can be anything
              },
              type: "change",
            },
          ],
        });
      }).then((css) => {
        debug(`virtualStyles.initial ${platform}`);
        return platform === "web"
          ? css
          : getNativeJS(cssToReactNativeRuntime(css, options), debug);
      }),
    );
  }
}

/**
 * Patch the Metro File system to new cache virtual modules
 */
function ensureFileSystemPatched(
  fs: FileSystem & {
    getSha1: {
      __css_interop_patched?: boolean;
    };
  },
) {
  if (!fs.getSha1.__css_interop_patched) {
    const original_getSha1 = fs.getSha1.bind(fs);
    fs.getSha1 = (filename) => {
      if (virtualModules.has(filename)) {
        // Don't cache this file. It should always be fresh.
        return `${filename}-${Date.now()}`;
      }
      return original_getSha1(filename);
    };
    fs.getSha1.__css_interop_patched = true;
  }

  return fs;
}

/**
 * Patch the bundler to use virtual modules
 */
function ensureBundlerPatched(
  bundler: ReturnType<ReturnType<MetroServer["getBundler"]>["getBundler"]> & {
    transformFile: { __css_interop__patched?: boolean };
  },
) {
  if (bundler.transformFile.__css_interop__patched) {
    return;
  }

  const transformFile = bundler.transformFile.bind(bundler);

  bundler.transformFile = async function (
    filePath,
    transformOptions,
    fileBuffer,
  ) {
    const virtualModule = virtualModules.get(filePath);

    if (virtualModule) {
      fileBuffer = Buffer.from(await virtualModule);
    }
    return transformFile(filePath, transformOptions, fileBuffer);
  };
  bundler.transformFile.__css_interop__patched = true;
}

function getNativeJS(data = {}, debug: Debugger): string {
  debug("Start stringify");
  const output = `(${stringify(data)})`;
  debug(`Output size: ${Buffer.byteLength(output, "utf8")} bytes`);
  return output;
}

function platformPath(platform = "native") {
  return path.join(
    outputDirectory,
    `${platform}.${platform === "web" ? "css" : "js"}`,
  );
}

/**
 * Convert a data structure to JavaScript.
 * The output should be similar to JSON, but without the extra characters.
 */
function stringify(data: unknown): string {
  switch (typeof data) {
    case "bigint":
    case "symbol":
    case "function":
      throw new Error(`Cannot stringify ${typeof data}`);
    case "string":
      return `"${data}"`;
    case "number":
      // Reduce to 3 decimal places
      return `${Math.round(data * 1000) / 1000}`;
    case "boolean":
      return `${data}`;
    case "undefined":
      // null is processed faster than undefined
      // JSON.stringify also converts undefined to null
      return "null";
    case "object": {
      if (data === null) {
        return "null";
      } else if (Array.isArray(data)) {
        return `[${data
          .map((value) => {
            // These values can be omitted to create a holey array
            // This is slightly slower to parse at runtime, but keeps the
            // file size smaller
            return value === null || value === undefined
              ? ""
              : stringify(value);
          })
          .join(",")}]`;
      } else {
        return `{${Object.entries(data)
          .flatMap(([key, value]) => {
            // If an object's property is undefined or null we can just skip it
            if (value === null || value === undefined) {
              return [];
            }

            // Make sure we quote strings that require quotes
            if (key.match(/[^a-zA-Z]/)) {
              key = `"${key}"`;
            }

            value = stringify(value);

            return [`${key}:${value}`];
          })
          .join(",")}}`;
      }
    }
  }
}
