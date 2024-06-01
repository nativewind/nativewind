import connect from "connect";
import { readFileSync } from "fs";
import { IncomingMessage, ServerResponse } from "http";
import type { MetroConfig } from "metro-config";
import type MetroServer from "metro/src/Server";
import type { FileSystem } from "metro-file-map";

import { expoColorSchemeWarning } from "./expo";
import { CssToReactNativeRuntimeOptions } from "../types";
import { cssToReactNativeRuntime } from "../css-to-rn";

/**
 * Injects the CSS into the React Native runtime.
 *
 * Web:
 *  - The input file is changed into a virtual module.
 *  - On changes, the haste server is updated
 *
 * Native:
 *  - The $$style file is changed into a virtual module, with the initial styles injected.
 *  - Updates are provided via a custom polling server
 *
 * The custom polling server is a hack due to fast-refresh not working on native.
 * Cause the styles are "global", I need to work within the fast-refresh rule set so
 * the entire application isn't reloaded. These are not well documented, and I'm not sure
 * its possible, so the polling server is a workaround.
 */
export type WithCssInteropOptions = CssToReactNativeRuntimeOptions & {
  input: string;
  getPlatformCSS: GetPlatformCSS;
};

const $$injectedFilePath = require.resolve(
  `react-native-css-interop/dist/runtime/native/$$styles.js`,
);
const fileTemplate = readFileSync($$injectedFilePath, "utf-8");
const connections = new Map<string, Set<ServerResponse<IncomingMessage>>>();

const getInjectedStyles = (data = {}) => {
  return Buffer.from(
    fileTemplate.replace(
      "injectData(CSS_INTEROP_INJECTION);",
      `injectData(${JSON.stringify(data)});`,
    ),
  );
};

const virtualModules = new Set<string>();
const processedCSS: Partial<
  Record<
    string,
    | { pollVersion: number; promise: Promise<{ css: Buffer; js: Buffer }> }
    | undefined
  >
> = {};

export type GetPlatformCSS = (
  platform: string,
  dev: boolean,
  next: (update: string) => void,
) => Promise<string>;

export function withCssInterop(
  config: MetroConfig,
  { input, getPlatformCSS, ...options }: WithCssInteropOptions,
): MetroConfig {
  expoColorSchemeWarning();
  const originalResolver = config.resolver?.resolveRequest;
  const originalMiddleware = config.server?.enhanceMiddleware;

  let haste: any;

  const initPreprocessedFile = async (
    filePath: string,
    platform: string,
    dev: boolean,
  ) => {
    if (processedCSS[platform]) {
      return;
    }

    const onUpdate = (css: string) => {
      const current = processedCSS[platform];
      if (!current) return;

      const data = cssToReactNativeRuntime(css, options);

      current.pollVersion++;
      current.promise = Promise.resolve({
        css: Buffer.from(css),
        js: getInjectedStyles(data),
      });

      if (platform === "web") {
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
      } else {
        // This is where we should emit haste changes
        // Instead we update the clients
        const connectionSet = connections.get(platform);

        if (!connectionSet) return;
        for (const connection of connectionSet) {
          connection.write(
            `data: {"version":${current.pollVersion},"data":${JSON.stringify(
              data,
            )}}\n\n`,
          );
          connection.end();
        }
      }
    };

    virtualModules.add(filePath);
    processedCSS[platform] = {
      pollVersion: 0,
      promise: getPlatformCSS(platform, dev, onUpdate).then((css) => {
        return {
          css: Buffer.from(css),
          js: getInjectedStyles(cssToReactNativeRuntime(css, options)),
        };
      }),
    };
  };

  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...(config?.resolver?.sourceExts || []), "css"],
      resolveRequest: (context, moduleName, platform) => {
        platform = platform || "native";

        const resolved =
          originalResolver?.(context, moduleName, platform) ||
          context.resolveRequest(context, moduleName, platform);

        if (!("filePath" in resolved)) {
          return resolved;
        }

        if (platform === "web") {
          // Override the input file to the transformed CSS
          if (resolved.filePath === input) {
            initPreprocessedFile(
              resolved.filePath,
              platform,
              (context as any).dev,
            );
          }

          return resolved;
        } else {
          if (resolved.filePath === input) {
            // Native ignores the input file.
            return { type: "empty" };
          } else if (resolved.filePath === $$injectedFilePath) {
            // Instead, we inject the processed CSS.
            const platform$$injectedFilePath = `${$$injectedFilePath}.${platform}.js`;

            initPreprocessedFile(
              platform$$injectedFilePath,
              platform,
              (context as any).dev,
            );

            return {
              ...resolved,
              filePath: platform$$injectedFilePath,
            };
          } else {
            return resolved;
          }
        }
      },
    },
    server: {
      ...config.server,
      enhanceMiddleware: (middleware, metroServer) => {
        const bundler = metroServer.getBundler().getBundler();

        const initPromise = bundler
          .getDependencyGraph()
          .then(async (graph: any) => {
            haste = graph._haste;
            ensureFileSystemPatched(graph._fileSystem);
            ensureBundlerPatched(bundler);
          });

        let server = connect();

        // Delay requests until the initialization is done.
        server.use(async (_, __, next) => {
          await initPromise;
          next();
        });

        // This is used to get updates on Native
        server.use("/__css_interop_update_endpoint", async (req, res) => {
          const url = new URL(req.url || "", "http://localhost");
          const platform = url.searchParams.get("platform") || "native";
          const version = parseInt(url.searchParams.get("version") || "0");

          const current = processedCSS[platform];
          let connectionSet = connections.get(platform);
          if (!connectionSet) {
            connectionSet = new Set();
            connections.set(platform, connectionSet);
          }

          // Response with the current version if the client is out of sync
          if (current && version !== current.pollVersion) {
            res.write(
              `data: {"version":${current.pollVersion},"data":${JSON.stringify(
                await current.promise,
              )}}\n\n`,
            );
            res.end();
            return;
          }

          // Otherwise wait for the next update
          connectionSet.add(res);

          res.writeHead(200, {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            Connection: "keep-alive",
          });

          setTimeout(() => {
            res.end();
            connectionSet.delete(res);
          }, 30000);

          req.on("close", () => connectionSet.delete(res));
        });

        if (originalMiddleware) {
          server.use(originalMiddleware(middleware, metroServer));
        } else {
          server.use(middleware);
        }

        return server;
      },
    },
  };
}

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
    const platform = transformOptions.platform || "native";

    if (virtualModules.has(filePath)) {
      const promise = processedCSS[platform]!.promise;
      if (!promise) {
        throw new Error(`No promise found for virtual module ${filePath}`);
      }

      if (platform === "web") {
        const { css } = await promise;
        fileBuffer = css;
      } else {
        const { js } = await promise;
        fileBuffer = js;
      }
    }

    return originalTransformFile(filePath, transformOptions, fileBuffer);
  };

  bundler.transformFile.__css_interop__patched = true;
}
