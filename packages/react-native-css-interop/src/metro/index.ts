import connect from "connect";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import type { MetroConfig } from "metro-config";
import type MetroServer from "metro/src/Server";
import type { FileSystem } from "metro-file-map";

import { expoColorSchemeWarning } from "./expo";
import { CssToReactNativeRuntimeOptions } from "../types";
import { cssToReactNativeRuntime } from "../css-to-rn";
import { getNativeJS, platformPath } from "./shared";

/**
 * Injects the CSS into the React Native runtime.
 *
 * Web:
 *  - The contexts of the input file are replaced with the result of getDevelopment
 *
 * Native:
 *  - The context of the input file are replaced with the compiled version of getDevelopment
 */
export type WithCssInteropOptions = CssToReactNativeRuntimeOptions & {
  input: string;
  platforms?: string[];
  processPROD: (platform: string) => string | Buffer;
  processDEV: (
    platform: string,
    next: (update: string) => void,
  ) => Promise<string>;
};

let haste: any;
const virtualModules = new Map<string, Promise<Buffer>>();

export function withCssInterop(
  config: MetroConfig,
  {
    platforms = ["ios", "android", "web", "native"],
    ...options
  }: WithCssInteropOptions,
): MetroConfig {
  expoColorSchemeWarning();
  const originalResolver = config.resolver?.resolveRequest;
  const originalMiddleware = config.server?.enhanceMiddleware;

  // Ensure the production files exist before Metro starts
  const prodOutputDir = path.join(
    path.dirname(require.resolve("react-native-css-interop/package.json")),
    ".cache",
  );

  fs.mkdirSync(prodOutputDir, { recursive: true });

  for (const platform of platforms) {
    fs.writeFileSync(
      path.join(
        prodOutputDir,
        `${platform}.${platform === "web" ? "css" : "js"}`,
      ),
      "",
    );
  }

  return {
    ...config,
    transformer: {
      ...config.transformer,
      async getTransformOptions(
        entryPoints,
        transformOptions,
        getDependenciesOf,
      ) {
        // Generate the production file before we start processing it
        if (!transformOptions.dev) {
          const platform = transformOptions.platform || "native";

          await fsPromises.mkdir(prodOutputDir, { recursive: true });

          const output = path.join(
            prodOutputDir,
            `${platform}.${platform === "web" ? "css" : "js"}`,
          );

          await fsPromises.writeFile(
            output,
            getNativeJS(
              cssToReactNativeRuntime(options.processPROD(platform), options),
            ),
          );
        }

        return (
          config.transformer?.getTransformOptions?.(
            entryPoints,
            transformOptions,
            getDependenciesOf,
          ) || {}
        );
      },
    },
    resolver: {
      ...config.resolver,
      sourceExts: [...(config?.resolver?.sourceExts || []), "css"],
      resolveRequest: (context, moduleName, platform) => {
        const resolver = originalResolver ?? context.resolveRequest;
        const resolved = resolver(context, moduleName, platform);

        // We only care about the input file
        if (!("filePath" in resolved && resolved.filePath === options.input)) {
          return resolved;
        }

        platform = platform || "native";

        const isDev = (context as any).dev;

        if (isDev) {
          // Generate a fake name for our virtual module. Make it platform specific
          const platformFilePath = platformPath(resolved.filePath, platform);

          // Start the css processor
          initPreprocessedFile(platformFilePath, platform, options, true);

          // Make the input file instead resolve to our virtual module
          return resolver(context, removeExt(platformFilePath), platform);
        } else {
          return resolver(
            context,
            path.join("react-native-css-interop", ".cache", platform),
            platform,
          ) as any;
        }
      },
    },
    server: {
      ...config.server,
      /**
       * NOTE: enhanceMiddleware is commonly only called in development environment
       */
      enhanceMiddleware: (middleware, metroServer) => {
        /**
         * We need to patch Metro internals to add virtual modules.
         *
         * The easiest way is through the Metro middleware, where we can
         * access the bundlers.
         */
        const server = connect();
        const bundler = metroServer.getBundler().getBundler();

        const initPromise = bundler
          .getDependencyGraph()
          .then(async (graph: any) => {
            haste = graph._haste;
            ensureFileSystemPatched(graph._fileSystem);
            ensureBundlerPatched(bundler);
          });

        // Patching is async, so we need to delay everything until all patches have been applied
        server.use(async (_, __, next) => {
          await initPromise;
          next();
        });

        return originalMiddleware
          ? server.use(originalMiddleware(middleware, metroServer))
          : server.use(middleware);
      },
    },
  };
}

async function initPreprocessedFile(
  filePath: string,
  platform: string,
  { input, processDEV, ...options }: WithCssInteropOptions,
  dev: boolean,
) {
  if (virtualModules.has(filePath)) {
    return;
  }

  virtualModules.set(
    filePath,
    processDEV(
      platform,
      // This should only be called in development when a file changes
      (css: string) => {
        virtualModules.set(
          filePath,
          Promise.resolve(
            platform === "web"
              ? Buffer.from(css)
              : getNativeJS(cssToReactNativeRuntime(css, options), dev),
          ),
        );

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
      },
    ).then((css) => {
      return platform === "web"
        ? Buffer.from(css)
        : getNativeJS(cssToReactNativeRuntime(css, options), dev);
    }),
  );
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

  const originalTransformFile = bundler.transformFile.bind(bundler);

  bundler.transformFile = async function (
    filePath,
    transformOptions,
    fileBuffer,
  ) {
    const virtualModule = virtualModules.get(filePath);
    if (virtualModule) {
      fileBuffer = await virtualModule;
    }

    return originalTransformFile(filePath, transformOptions, fileBuffer);
  };
  bundler.transformFile.__css_interop__patched = true;
}

/**
 * Remove the last extension from a filePath
 * @param filePath
 * @returns
 */
function removeExt(filePath: string) {
  return filePath.replace(/\.[^/.]+$/, "");
}
