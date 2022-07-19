import { Config } from "tailwindcss";
import resolveTailwindConfig from "tailwindcss/resolveConfig";
import {
  OptionalConfig,
  RequiredConfig,
  ThemeConfig,
} from "tailwindcss/types/config";

// These types are wrong, but they prevent typescript errors
// while still keeping some types.
type PlatformConfig =
  | Config
  | (RequiredConfig & Partial<PlatformOptionalConfig>);

type PlatformOptionalConfig = Omit<OptionalConfig, "theme"> & {
  theme: Partial<
    PlatformThemeConfig & { extend: Partial<PlatformThemeConfig> }
  >;
};

interface PlatformThemeConfig {
  [k: keyof ThemeConfig]: ThemeConfig[keyof ThemeConfig];
}

export function withPlatformTheme(tailwindConfig: PlatformConfig) {
  const config: Config = resolveTailwindConfig(tailwindConfig);

  if (!config.theme) return config;

  // This is set my the native tailwind plugin. If that plugin is loaded
  // then its assumed that we are not outputting CSS
  const isNative = process.env.NATIVEWIND_NATIVE_PLUGIN_ENABLED;

  const theme: Record<string, unknown> = {};
  const extendTheme: Record<string, unknown> = {};

  function resolvePlatformThemes(
    key: string,
    value: unknown,
    root = extendTheme
  ) {
    if (typeof value !== "object") return;
    if (value === null) return;

    if (hasPlatformKeys(value)) {
      if (isNative) {
        const platformParameter = Object.entries(value)
          .map((entry) => entry.join(":"))
          .join(" ");

        root[key] = `platform(${platformParameter})`;
      } else {
        root[key] =
          (value as Record<string, unknown>).web ||
          (value as Record<string, unknown>).default;
      }
    } else {
      root[key] ??= {};
      for (const [valueKey, valueValue] of Object.entries(value)) {
        resolvePlatformThemes(
          valueKey,
          valueValue,
          root[key] as Record<string, unknown>
        );
      }
    }
  }

  for (const [key, value] of Object.entries(config.theme)) {
    if (key === "extend") {
      continue;
    }

    resolvePlatformThemes(key, value, theme);
  }

  if (config.theme.extend) {
    for (const [key, value] of Object.entries(config.theme.extend)) {
      if (key === "extend") {
        continue;
      }

      resolvePlatformThemes(key, value, extendTheme);
      (config.theme as Record<string, unknown>).extend = extendTheme;
    }
    theme.extend = extendTheme;
  }

  config.theme = theme;

  return config;
}

function hasPlatformKeys(themeObject: object) {
  return (
    "ios" in themeObject ||
    "android" in themeObject ||
    "web" in themeObject ||
    "windows" in themeObject ||
    "default" in themeObject ||
    "DEFAULT" in themeObject ||
    "macos" in themeObject
  );
}
