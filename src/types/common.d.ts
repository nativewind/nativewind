import type {
  ImageStyle,
  TextStyle,
  ViewStyle,
} from "react-native";

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleRecord = Record<string, Style>;
export type Media = [string, number];
export type MediaRecord = Record<string, Media[]>;
