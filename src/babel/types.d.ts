import { ViewStyle, TextStyle, ImageStyle, LayoutStyle } from "react-native";
import * as BabelCore from "@babel/core";

export type Babel = typeof BabelCore;

export type Style = ViewStyle | TextStyle | ImageStyle;
export type StyleRecord = Record<string, Style>;
export type MediaRecord = Record<
  string,
  Array<{ media: string[]; suffix: number }>
>;

export type PathOption = string;
export type AllowPathOptions = "*" | PathOption[];

export interface TailwindReactNativeOptions {
  allowModules?: AllowPathOptions;
  blockModules?: PathOption[];
  platform?: "web" | "native" | "native-context" | "native-inline";
  rem?: number;
  tailwindConfigPath?: string;
}

export type State = {
  get: (name: string) => any;
  set: (name: string, value: any) => any;
  opts: TailwindReactNativeOptions;
  file: BabelCore.BabelFile;
  filename: string;
};
