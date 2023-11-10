import type {
  IntermediateConfigT,
  GetTransformOptions,
  TransformerConfigT,
} from "metro-config";
import { expoColorSchemeWarning } from "./expo";
import { CssToReactNativeRuntimeOptions } from "../types";

export type { CssToReactNativeRuntimeOptions };

export type ComposableTransformerConfigT = TransformerConfigT & {
  transformerPath?: string;
  cssToReactNativeRuntime?: CssToReactNativeRuntimeOptions;
} & Record<string, unknown>;

export interface ComposableIntermediateConfigT extends IntermediateConfigT {
  transformer: ComposableTransformerConfigT;
}

export function withCssInterop(
  config: ComposableIntermediateConfigT,
  options: CssToReactNativeRuntimeOptions,
): ComposableIntermediateConfigT {
  const getTransformOptions = async (
    ...args: Parameters<GetTransformOptions>
  ) => {
    expoColorSchemeWarning();
    return config.transformer?.getTransformOptions?.(...args);
  };

  return {
    ...config,
    resolver: {
      ...config.resolver,
      sourceExts: [...config?.resolver.sourceExts, "css"],
    },
    transformerPath: require.resolve("./transformer"),
    transformer: {
      ...config.transformer,
      cssToReactNativeRuntime: options,
      getTransformOptions,
      transformerPath: config.transformerPath,
    },
  };
}
