import connect from "connect";
import type { GetTransformOptionsOpts } from "metro-config";
import loadConfig from "tailwindcss/loadConfig";
import tailwindPackage from "tailwindcss/package.json";
import micromatch from "micromatch";

import path from "path";
import {
  withCssInterop,
  CssToReactNativeRuntimeOptions,
  ComposableIntermediateConfigT,
  middleware as cssInteropMiddleware,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./common";
import { tailwindCli } from "./tailwind-cli";

interface WithNativeWindOptions extends CssToReactNativeRuntimeOptions {
  input: string;
  projectRoot?: string;
  outputDir?: string;
  configPath?: string;
  cliCommand?: string;
  browserslist?: string | null;
  browserslistEnv?: string | null;
}

export function withNativeWind(
  metroConfig: ComposableIntermediateConfigT,
  {
    input,
    outputDir = ["node_modules", ".cache", "nativewind"].join(path.sep),
    projectRoot = process.cwd(),
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config.js",
    cliCommand = `node ${path.join(
      require.resolve("tailwindcss/package.json"),
      "../",
      tailwindPackage.bin.tailwindcss,
    )}`,
    browserslist = "last 1 version",
    browserslistEnv = "native",
  }: WithNativeWindOptions = {} as WithNativeWindOptions,
) {
  if (!input) {
    throw new Error(
      "withNativeWind requires an input parameter: `withNativeWind(config, { input: <css-file> })`",
    );
  }

  input = path.resolve(input);

  const { important: importantConfig, content } = loadConfig(
    path.resolve(tailwindConfigPath),
  );

  const contentArray = "files" in content ? content.files : content;

  metroConfig = withCssInterop(metroConfig, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
    selectorPrefix:
      typeof importantConfig === "string" ? importantConfig : undefined,
  });

  // eslint-disable-next-line unicorn/prefer-module
  metroConfig.transformerPath = require.resolve("./transformer");

  const existingEnhanceMiddleware = metroConfig.server.enhanceMiddleware;
  metroConfig.server = {
    ...metroConfig.server,
    enhanceMiddleware(middleware, metroServer) {
      if (existingEnhanceMiddleware) {
        middleware = existingEnhanceMiddleware(middleware, metroServer);
      }

      return connect()
        .use(...cssInteropMiddleware)
        .use(middleware);
    },
  };

  const tailwindCliPromises: Record<
    string,
    ReturnType<typeof tailwindCli>
  > = {};

  // Use getTransformOptions to bootstrap the Tailwind CLI, but ensure
  // we still call the original
  const previousTransformOptions = metroConfig.transformer?.getTransformOptions;
  metroConfig.transformer = {
    ...metroConfig.transformer,
    nativewind: {
      input,
      outputs: {},
    },
    getTransformOptions: async (
      entryPoints: ReadonlyArray<string>,
      options: GetTransformOptionsOpts,
      getDependenciesOf: (filePath: string) => Promise<string[]>,
    ) => {
      const output = path.resolve(
        projectRoot,
        path.join(outputDir, path.basename(input!)),
      );

      const matchesOutputDir = contentArray.some((pattern) => {
        if (typeof pattern !== "string") return false;
        return micromatch.isMatch(output, pattern);
      });

      if (matchesOutputDir) {
        throw new Error(
          `NativeWind: Your '${tailwindConfigPath}#content' includes the output file ${output} which will cause an infinite loop. Please read https://tailwindcss.com/docs/content-configuration#styles-rebuild-in-an-infinite-loop`,
        );
      }

      // Clear Metro's progress bar and move to the start of the line
      // We will print out own output before letting Metro print again
      if (process.stdout.isTTY) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
      }

      const platform = options.platform ?? "native";

      // Generate the styles, only start the process onces per platform
      tailwindCliPromises[platform] ||= tailwindCli(input!, metroConfig, {
        ...options,
        output: `${output}.${platform}.css`,
        cliCommand,
        browserslist,
        browserslistEnv,
      });

      (metroConfig as any).transformer.nativewind.outputs[platform] =
        await tailwindCliPromises[platform];

      return previousTransformOptions?.(
        entryPoints,
        options,
        getDependenciesOf,
      );
    },
  };

  return metroConfig;
}
