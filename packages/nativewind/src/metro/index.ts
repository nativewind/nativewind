import type { GetTransformOptionsOpts } from "metro-config";
import loadConfig from "tailwindcss/loadConfig";
import type { ServerOptions } from "ws";

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
  hotServerOptions?: ServerOptions;
}

const outputDir = ["node_modules", ".cache", "nativewind"].join(path.sep);

export function withNativeWind(
  metroConfig: ComposableIntermediateConfigT,
  {
    input,
    output,
    inlineRem = 14,
    configPath: tailwindConfigPath = "tailwind.config",
    hotServerOptions = {
      port: 8089,
    },
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

  const { important: importantConfig } = loadConfig(
    path.resolve(tailwindConfigPath),
  );

  metroConfig = withCssInterop(metroConfig, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
    selectorPrefix:
      typeof importantConfig === "string" ? importantConfig : undefined,
  });

  // eslint-disable-next-line unicorn/prefer-module
  metroConfig.transformerPath = require.resolve(
    "nativewind/dist/metro/transformer",
  );

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
        await tailwindCli(input, {
          ...options,
          output,
          hotServerOptions,
        });
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
