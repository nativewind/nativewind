import { Config } from "tailwindcss";
import resolveTailwindConfig from "tailwindcss/resolveConfig";

interface WithPlatformThemeOptions {
  previewCss?: boolean;
}

export function withPlatformTheme(
  tailwindConfig: Config,
  { previewCss = false }: WithPlatformThemeOptions = {}
) {
  const config: Config = resolveTailwindConfig(tailwindConfig);

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
        root[key] =
          (value as Record<string, unknown>).web ||
          (value as Record<string, unknown>).default;
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
    [keyof Config["theme"], string | Record<string, unknown>]
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
