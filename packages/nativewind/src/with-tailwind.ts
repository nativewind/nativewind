import {
  ConfigT,
  withCssInterop,
  getInputOutput,
  WithCssInteropOptions,
} from "react-native-css-interop/metro";
import { build as twBuild } from "tailwindcss/lib/cli/build";

export function withTailwind(config: ConfigT, options?: WithCssInteropOptions) {
  const getTransformOptions = async (
    entryPoints: any,
    options: any,
    getDependenciesOf: any,
  ) => {
    process.stdout.clearLine(0);

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
    options,
  );
}
