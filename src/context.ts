import { createContext } from "react";
import {
  Appearance,
  ColorSchemeName,
  ImageStyle,
  Platform,
  TextStyle,
  ViewStyle,
} from "react-native";

export type StyleRecord = Record<string, ViewStyle | TextStyle | ImageStyle>;

export type MediaRules = Record<
  string,
  Array<{ media: string[]; suffix: number }>
>;

declare global {
  // eslint-disable-next-line no-var
  var tailwindcss_react_native_style: StyleRecord;
  // eslint-disable-next-line no-var
  var tailwindcss_react_native_media: MediaRules;
}

globalThis.tailwindcss_react_native_style ??= {};
globalThis.tailwindcss_react_native_media ??= {};

export const TailwindStyleContext = createContext<StyleRecord>(
  globalThis.tailwindcss_react_native_style
);
export const TailwindMediaContext = createContext<MediaRules>(
  globalThis.tailwindcss_react_native_media
);

export const TailwindColorSchemeContext = createContext<ColorSchemeName>(
  Appearance.getColorScheme()
);
export const TailwindSetColorSchemeContext = createContext<
  (colorScheme: ColorSchemeName) => void
>(() => {
  return;
});
export const TailwindPlatformContext = createContext<
  typeof Platform.OS | "native" | undefined
>(undefined);
