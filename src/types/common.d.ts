import type { Declaration } from "postcss";
import type { ImageStyle, TextStyle, ViewStyle } from "react-native";

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleArray = Array<Style | AtRuleRecord>;
export type StyleRecord = Record<string, StyleArray>;

export type MediaRecord = Record<string, Array<AtRuleTuple[]>>;

export type AtRuleTuple = [string, string];

export interface AtRuleRecord extends Style {
  atRules: AtRuleTuple[];
}

export interface StyleError {
  declaration?: Declaration;
  error: string;
  result?: Style;
}
