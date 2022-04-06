import { createContext } from "react";
import {
  Appearance,
  ColorSchemeName,
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";

export interface TailwindStyleContext {
  styles: StyleRecord;
  media: MediaRules;
}

export type StyleRecord = Record<string, ViewStyle | TextStyle | ImageStyle>;

export type MediaRules = Record<
  string,
  Array<{ media: string[]; suffix: number }>
>;

export const TailwindStyleContext = createContext<TailwindStyleContext>({
  styles: {},
  media: {},
});

export const TailwindColorSchemeContext = createContext<ColorSchemeName>(
  Appearance.getColorScheme()
);
export const TailwindSetColorSchemeContext = createContext<
  (colorScheme: ColorSchemeName) => void
>(() => {});
