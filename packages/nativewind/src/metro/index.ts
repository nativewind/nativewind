import path from "node:path";
import postcss from "postcss";
import type { GetTransformOptionsOpts } from "metro-config";
import {
  withCssInterop,
  CssToReactNativeRuntimeOptions,
  ComposableIntermediateConfigT,
} from "react-native-css-interop/metro";
import { build as twBuild } from "tailwindcss/lib/cli/build";
import { cssToReactNativeRuntimeOptions } from "./with-tailwind-options";

interface WithNativeWindOptions extends CssToReactNativeRuntimeOptions {
  input?: string;
  output?: string;
}

export function withNativeWind(
  config: ComposableIntermediateConfigT,
  { input = "global.css", output, inlineRem = 14 }: WithNativeWindOptions = {},
) {
  if (!output) {
    output = path.resolve(
      process.cwd(),
      path.join(`node_modules/.cache/nativewind`, input),
    );
  }

  input = path.resolve(process.cwd(), input);

  config = withCssInterop(config, {
    ...cssToReactNativeRuntimeOptions,
    inlineRem,
  });

  // Override the transformerPath to NativeWind's.
  // It will manually call the react-native-css-interop transformer
  // eslint-disable-next-line unicorn/prefer-module
  config.transformerPath = require.resolve("nativewind/dist/metro/transformer");

  let tailwindHasStarted = false;

  // Use getTransformOptions to bootstrap the Tailwind CLI, but ensure
  // we still call the original
  const previousTransformOptions = config.transformer?.getTransformOptions;
  config.transformer = {
    ...config.transformer,
    nativewind: {
      input,
      output,
    },
    getTransformOptions: async (
      entryPoints: ReadonlyArray<string>,
      options: GetTransformOptionsOpts,
      getDependenciesOf: (filePath: string) => Promise<string[]>,
    ) => {
      // Clear Metro's progress bar and move to the start of the line
      // We will print out own output before letting Metro print again
      if (process.stdout.isTTY) {
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
      }

      if (options.platform !== "web") {
        process.env.NATIVEWIND_NATIVE = "1";
      }

      if (!tailwindHasStarted) {
        tailwindHasStarted = true;

        await twBuild({
          "--input": input,
          "--output": output,
          "--watch": options.dev ? "always" : undefined,
          "--poll": true,
        });
      }

      return previousTransformOptions?.(
        entryPoints,
        options,
        getDependenciesOf,
      );
    },
  };

  return config;
}
