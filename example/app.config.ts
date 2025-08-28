import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: "example",
    slug: "example",
    plugins: ["expo-dev-client"],
    userInterfaceStyle: "automatic",
    android: {
      package: "dev.nativewind",
    },
    ios: {
      bundleIdentifier: "dev.nativewind",
    },
    experiments: {
      reactCompiler: false,
      buildCacheProvider:
        process.env.CI || process.env.EAS_BUILD_CACHE_PROVIDER
          ? "eas"
          : undefined,
    },
  };
};
