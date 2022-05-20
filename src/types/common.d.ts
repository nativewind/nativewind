import type { Declaration } from "postcss";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleRecord = Record<string, Array<Style | AtRuleRecord>>;
export type MediaRecord = Record<string, Array<AtRuleTuple[]>>;

export type AtRuleTuple = [string, string];

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
