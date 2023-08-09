import type { GetTransformOptionsOpts } from "metro-config";
import loadConfig from "tailwindcss/loadConfig";

import path from "node:path";
import {
  withCssInterop,
  CssToReactNativeRuntimeOptions,
  ComposableIntermediateConfigT,
} from "react-native-css-interop/metro";

import { cssToReactNativeRuntimeOptions } from "./with-tailwind-options";
import { tailwindCli } from "./tailwind-cli";

interface WithNativeWindOptions extends CssToReactNativeRuntimeOptions {
  input?: string;
  output?: string;
  configPath?: string;
}

const outputDir = ["node_modules", ".cache", "nativewind"].join(path.sep);

export function withNativeWind(
  metroConfig: ComposableIntermediateConfigT,
  {
    input,
    output,
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config",
  }: WithNativeWindOptions,
) {
  if (!input) {
    throw new Error(
      "withNativeWind requires an input parameter: `withNativeWind({ input: <css-file> })`",
    );
  } else {
    input = path.resolve(input);
  }

  if (!output) {
    output = path.resolve(
      process.cwd(),
      path.join(outputDir, path.basename(input)),
    );
  } else if (!path.isAbsolute(output)) {
    output = path.resolve(output);
  }

  metroConfig = withCssInterop(metroConfig, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
  });

  const { important: importantConfig } = loadConfig(
    path.resolve(tailwindConfigPath),
  );

  // eslint-disable-next-line unicorn/prefer-module
  metroConfig.transformerPath = require.resolve(
    "nativewind/dist/metro/transformer",
  );

  let tailwindHasStarted: Record<string, boolean> = {
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
    cssToReactNativeRuntime: {
      selectorPrefix:
        typeof importantConfig === "string" ? importantConfig : undefined,
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
        tailwindCli(input, output, options, true);

        // Watch for style changes. Do this after the initial generation so we can ensure
        // the output file will always exist
        if (options.dev && options.hot) {
          tailwindCli(input, output, options, false);
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
