import { TailwindConfig, TailwindTheme } from "tailwindcss/tailwind-config";
import resolveTailwindConfig from "tailwindcss/resolveConfig";

interface WithPlatformThemeOptions {
  previewCss?: boolean;
}

export function withPlatformTheme(
  tailwindConfig: TailwindConfig,
  { previewCss = false }: WithPlatformThemeOptions
) {
  const config = resolveTailwindConfig(tailwindConfig);

  if (!config.theme) return config;

  const extendTheme: Record<string, unknown> = {};

  function resolvePlatformThemes(
    key: string,
    value: unknown,
    root = extendTheme
  ) {
    if (typeof value !== "object") return;
    if (value === null) return;

    if (hasPlatformKeys(value)) {
      if (previewCss) {
        root[key] = value.web || value.default;
      } else {
        const platformParameter = Object.entries(value)
          .map((entry) => entry.join(":"))
          .join(" ");

        root[key] = `platform(${platformParameter})`;
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

  for (const [key, value] of Object.entries(config.theme) as Array<
    [keyof TailwindTheme, string | Record<string, unknown>]
  >) {
    resolvePlatformThemes(key, value);
  }

  (config.theme as Record<string, unknown>).extend = extendTheme;

  return config;
}

function hasPlatformKeys(themeObject: object) {
  return (
    "ios" in themeObject ||
    "android" in themeObject ||
    "web" in themeObject ||
    "windows" in themeObject ||
    "macos" in themeObject
  );
}
