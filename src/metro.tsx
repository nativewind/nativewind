import type { MetroConfig } from "metro-config";
import {
  withReactNativeCSS,
  type WithReactNativeCSSOptions,
} from "react-native-css/metro";

export function withNativewind<
  T extends MetroConfig | (() => Promise<MetroConfig>),
>(config: T, options?: WithReactNativeCSSOptions): T {
  return withReactNativeCSS(config, {
    globalClassNamePolyfill: true,
    typescriptEnvPath: "nativewind-env.d.ts",
    ...options,
  });
}

/**
 * @deprecated use `withNativewind` instead
 */
export const withNativeWind = withNativewind;
