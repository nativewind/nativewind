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
 * Metro notes:
 *  - Expo uses a custom Metro server than the community CLI
 *  - @expo/cli and eas use slightly different Metro servers
 *    - eas skips the customMiddleware and the dev server is never started
 *    - expo export also skip the customMiddleware, but the dev server is started
 *  - Metro uses a virtual file system.
 *    - Metro can be configured to only react to ADD events in development
 *    - This means all files need to be present on the file system BEFORE Metro generates the file tree
 *  - Metro is undocumented. Good luck
 *
 * For these reasons we need to take multiple approaches with redundancies to ensure everything goes smoothly
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

  /*
   * Ensure the production files exist before Metro starts
   * Metro (or who ever is controlling Metro) will need to get the config before
   * its started, so we can generate these placeholder files to ensure that the
   * production files make it into the virtual file tree
   */
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
        /*
         * PRODUCTION ONLY!
         *
         * In production there might not be a dev server, so we don't actually know what is being processed
         * The best option is hook into the transform options which are called before the transform workers
         * are spawned.
         *
         * In production, we replace our placeholder files with the production ones
         * There is most likely some race condition here, but since this is the only async function before
         * files get processed, we can delay there server until everything is ready.
         *
         * Surprisingly, even in production, Metro registers the file update event and will update its file tree
         * (or maybe the file tree hasn't read the files yet? Or this breaks cache SHA1 hash?)
         */
        if (!transformOptions.dev) {
          const platform = transformOptions.platform || "native";

          await fsPromises.mkdir(prodOutputDir, { recursive: true });

          if (platform === "web") {
            const output = path.join(prodOutputDir, `web.css`);
            await fsPromises.writeFile(output, options.processPROD(platform));
          } else {
            const output = path.join(prodOutputDir, `${platform}.js`);
            await fsPromises.writeFile(
              output,
              getNativeJS(
                cssToReactNativeRuntime(options.processPROD(platform), options),
              ),
            );
          }
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
    server: {
      ...config.server,
      /*
       * DEVELOPMENT ONLY
       *
       * A better version than using getTransformOptions is to hook directly into the development server
       * All development clients (including websites) need to request the JS bundle. We can delay this as
       * we generate the virtual module
       *
       * Patching the MetroServer.fileSystem for virtual module support is a bit tricky, but its much more reliable
       * than listening to fileSystem events.
       *
       * This is also the only place the Metro exposes the MetroServer to the config.
       *
       * NOTE: This function is deprecated and should be replaced with unstable_devMiddleware, but no community CLI
       *       supports it at time of writing.
       */
      enhanceMiddleware: (middleware, metroServer) => {
        const server = connect();
        const bundler = metroServer.getBundler().getBundler();

        const initPromise = bundler
          .getDependencyGraph()
          .then(async (graph: any) => {
            haste = graph._haste;
            ensureFileSystemPatched(graph._fileSystem);
            ensureBundlerPatched(bundler);
          });

        server.use(async (_, __, next) => {
          // Wait until the bundler patching has completed
          await initPromise;
          next();
        });

        return originalMiddleware
          ? server.use(originalMiddleware(middleware, metroServer))
          : server.use(middleware);
      },
    },
    resolver: {
      ...config.resolver,
      sourceExts: [...(config?.resolver?.sourceExts || []), "css"],
      /*
       * PRODUCTION & DEVELOPMENT
       *
       * resolveRequest is where we switch the import of the CSS file for something different
       * In development this should be the virtual module
       * In production this is the generated file
       */
      resolveRequest: (context, moduleName, platform) => {
        const resolver = originalResolver ?? context.resolveRequest;
        const resolved = resolver(context, moduleName, platform);

        // We only care about the input file, ignore everything else
        if (!("filePath" in resolved && resolved.filePath === options.input)) {
          return resolved;
        }

        platform = platform || "native";

        const isDev = (context as any).dev;

        if (isDev) {
          // Generate a fake name for our virtual module. Make it platform specific
          const platformFilePath = platformPath(resolved.filePath, platform);

          startCSSProcessor(platformFilePath, platform, options, true);

          /*
           * Return a final Resolution.
           * We ideally we should call the resolver again with the new filepath,
           * but we can't control what it does. E.g it might check that the file actually exists
           */
          return {
            ...resolved,
            filePath: platformFilePath,
          };
        } else {
          return resolver(
            context,
            path.join("react-native-css-interop", ".cache", platform),
            platform,
          ) as any;
        }
      },
    },
  };
}

async function startCSSProcessor(
  filePath: string,
  platform: string,
  { input, processDEV, ...options }: WithCssInteropOptions,
  dev: boolean,
) {
  // Ensure that we only start the processor once per file
  if (virtualModules.has(filePath)) {
    return;
  }

  /*
   * The virtualStyles is a promise that will resolve with the initial value
   * If the `processDEV` needs to change the styles (e.g hot-reload) then it will use the callback function
   */
  const virtualStyles = processDEV(platform, (css: string) => {
    // Change the cached version with the new updated version
    virtualModules.set(
      filePath,
      Promise.resolve(
        platform === "web"
          ? Buffer.from(css)
          : getNativeJS(cssToReactNativeRuntime(css, options), dev),
      ),
    );

    // Tell Metro that the virtual module has changed
    // It will think this is a fileSystem event and update its virtual fileTree
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
    return platform === "web"
      ? Buffer.from(css)
      : getNativeJS(cssToReactNativeRuntime(css, options), dev);
  });

  virtualModules.set(filePath, virtualStyles);
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
