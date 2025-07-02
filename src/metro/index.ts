import type { MetroConfig } from "metro-config";
import {
  withReactNativeCSS,
  type WithReactNativeCSSOptions,
} from "react-native-css/metro";

export function withNativeWind<
  T extends MetroConfig | (() => Promise<MetroConfig>),
>(config: T, options?: WithReactNativeCSSOptions): T {
  return withReactNativeCSS(config, {
    ...options,
    libName: "nativewind",
    typescriptEnvPath: "nativewind-env.d.ts",
  });
}
