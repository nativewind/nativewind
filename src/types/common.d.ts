import type { Declaration } from "postcss";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleRecord = Record<string, Style>;
export type MediaRecord = Record<string, string[]>;
export interface StyleError {
  declaration?: Declaration;
  error: Error;
  result?: Style;
}
