import path from "path";
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
  {
    input = "global.css",
    output,
    inlineRem,
  }: WithNativeWindOptions = cssToReactNativeRuntimeOptions,
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
  config.transformerPath = require.resolve("nativewind/dist/metro/transformer");

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

      await twBuild({
        "--input": input,
        "--output": output,
        "--watch": options.dev ? "always" : false,
        "--poll": true,
      });

      return previousTransformOptions?.(
        entryPoints,
        options,
        getDependenciesOf,
      );
    },
  };

  return config;
}
