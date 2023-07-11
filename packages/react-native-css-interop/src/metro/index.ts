import type { ConfigT } from "metro-config";
import path from "path";

export type { ConfigT };

export interface WithCssInteropOptions {
  input?: string;
}

export function getInputOutput({
  input = "global.css",
}: WithCssInteropOptions = {}) {
  const output = path.resolve(
    process.cwd(),
    path.join(`node_modules/.cache/expo`, input),
  );

  input = path.resolve(process.cwd(), input);

  return { input, output };
}

export function withCssInterop(
  config: ConfigT,
  options?: WithCssInteropOptions,
) {
  const { input, output } = getInputOutput(options);

  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...config.resolver.sourceExts, "css"],
    },
    transformerPath: require.resolve(
      "react-native-css-interop/dist/metro/transformer",
    ),
    transformer: {
      ...config.transformer,
      existingTransformerPath: config.transformerPath,
      externallyManagedCss: {
        [input]: output,
      },
    },
  } as ConfigT;
}
