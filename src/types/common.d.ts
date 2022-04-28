import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleRecord = Record<string, Record<string, any>>;
export type MediaRecord = Record<string, string[]>;
export type StyleErrorRecord = Record<string, string>;
