import {
  ConfigT,
  withCssInterop,
  getInputOutput,
  WithCssInteropOptions,
} from "react-native-css-interop/metro";
import { build as twBuild } from "tailwindcss/lib/cli/build";
import { cssToReactNativeRuntimeOptions } from "./with-tailwind-options";

export function withTailwind(config: ConfigT, options?: WithCssInteropOptions) {
  const getTransformOptions = async (
    entryPoints: any,
    options: any,
    getDependenciesOf: any,
  ) => {
    // Clear Metro's progress bar and move to the start of the line
    // We will print out own output before letting Metro print again
    if (process.stdout.isTTY) {
      process.stdout.clearLine(0);
      process.stdout.cursorTo(0);
    }

    const { input, output } = getInputOutput(options);

    await twBuild({
      "--input": input,
      "--output": output,
      "--watch": options.dev ? "always" : false,
      "--poll": true,
    });

    return config.transformer?.getTransformOptions?.(
      entryPoints,
      options,
      getDependenciesOf,
    );
  };

  return withCssInterop(
    {
      ...config,
      transformer: {
        ...config.transformer,
        getTransformOptions,
      },
    },
    {
      ...options,
      cssToReactNativeRuntime: cssToReactNativeRuntimeOptions,
    },
  );
}
