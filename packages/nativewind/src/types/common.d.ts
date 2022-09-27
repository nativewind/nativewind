import type { Declaration } from "postcss";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

type RecursiveArray<T> = Array<T | ReadonlyArray<T> | RecursiveArray<T>>;

export type Style = ViewStyle & TextStyle & ImageStyle;
export type StyleArray = RecursiveArray<Style>;
export type StyleProp = Style | RecursiveArray<Style>;

export type StyleRecord = Record<string, Style>;
export type MediaRecord = Record<string, Array<AtRuleTuple[]>>;

export type AtRuleTuple = [string] | [string, string | number];

export interface AtRuleRecord extends Style {
  atRules: AtRuleTuple[];
  // This is cheating a bit, as TextStyle doesn't have transform
  // but it makes runtime-styles types easier
  transform?: TransformsStyle;
}

export interface StyleError {
  declaration?: Declaration;
  error: string;
  result?: Style;
}
