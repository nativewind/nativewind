import debug from "debug";
import type { MetroConfig } from "metro-config";
import {
  withReactNativeCSS,
  type WithReactNativeCSSOptions,
} from "react-native-css/metro";

export function withNativewind<
  T extends MetroConfig | (() => Promise<MetroConfig>),
>(config: T, options?: WithReactNativeCSSOptions): T {
  return withReactNativeCSS(config, {
    ...options,
    globalClassNamePolyfill: true,
    logger: debug("nativewind:metro"),
    typescriptEnvPath: "nativewind-env.d.ts",
  });
}

/** @deprecated Use withNativewind instead */
export const withNativeWind = withNativewind;
