import type { GetTransformOptionsOpts } from "metro-config";
import loadConfig from "tailwindcss/loadConfig";
import type { ServerOptions } from "ws";
import micromatch from "micromatch";

import path from "path";
import {
  withCssInterop,
  CssToReactNativeRuntimeOptions,
  ComposableIntermediateConfigT,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./common";
import { tailwindCli } from "./tailwind-cli";

interface WithNativeWindOptions extends CssToReactNativeRuntimeOptions {
  input?: string;
  projectRoot?: string;
  outputDir?: string;
  configPath?: string;
  hotServerOptions?: ServerOptions;
  cliCommand?: string;
}

export function withNativeWind(
  metroConfig: ComposableIntermediateConfigT,
  {
    input,
    outputDir = ["node_modules", ".cache", "nativewind"].join(path.sep),
    projectRoot = process.cwd(),
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config.js",
    cliCommand = "npx tailwindcss",
    hotServerOptions = {},
  }: WithNativeWindOptions = {},
) {
  if (!input) {
    throw new Error(
      "withNativeWind requires an input parameter: `withNativeWind({ input: <css-file> })`",
    );
  }

  const output = path.resolve(projectRoot, path.join(outputDir, input));
  input = path.resolve(input);

  const { important: importantConfig, content } = loadConfig(
    path.resolve(tailwindConfigPath),
  );

  const contentArray = "files" in content ? content.files : content;
  const matchesOutputDir = contentArray.some((pattern) => {
    if (typeof pattern !== "string") return false;
    return micromatch.isMatch(output, pattern);
  });

  if (matchesOutputDir) {
    throw new Error(
      `NativeWind: Your '${tailwindConfigPath}#content' includes the output file ${output} which will cause an infinite loop. Please read https://tailwindcss.com/docs/content-configuration#styles-rebuild-in-an-infinite-loop`,
    );
  }

  metroConfig = withCssInterop(metroConfig, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
    selectorPrefix:
      typeof importantConfig === "string" ? importantConfig : undefined,
  });

  // eslint-disable-next-line unicorn/prefer-module
  metroConfig.transformerPath = require.resolve("./transformer");

  const tailwindHasStarted: Record<string, boolean> = {
    native: false,
    web: false,
  };

  // Use getTransformOptions to bootstrap the Tailwind CLI, but ensure
  // we still call the original
  const previousTransformOptions = metroConfig.transformer?.getTransformOptions;
  metroConfig.transformer = {
    ...metroConfig.transformer,
    nativewind: {
      input,
      output,
    },
    getTransformOptions: async (
      entryPoints: ReadonlyArray<string>,
      options: GetTransformOptionsOpts,
      getDependenciesOf: (filePath: string) => Promise<string[]>,
    ) => {
      if (!output || !input) throw new Error("Invalid NativeWind config");

      // Clear Metro's progress bar and move to the start of the line
      // We will print out own output before letting Metro print again
      if (process.stdout.isTTY) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
      }

      const platform = options.platform === "web" ? "web" : "native";

      // Ensure we only spawn the subprocesses once
      if (!tailwindHasStarted[platform]) {
        tailwindHasStarted[platform] = true;

        // Generate the styles
        const cliOutput = await tailwindCli(input, metroConfig, {
          ...options,
          output,
          cliCommand,
          hotServerOptions,
        });

        if (cliOutput) {
          Object.assign((metroConfig as any).transformer.nativewind, cliOutput);
        }
      }

      return previousTransformOptions?.(
        entryPoints,
        options,
        getDependenciesOf,
      );
    },
  };

  return metroConfig;
}
