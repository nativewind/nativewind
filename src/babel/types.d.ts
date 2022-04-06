import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import * as BabelCore from "@babel/core";

export type Style = ViewStyle | TextStyle | ImageStyle;
export type Babel = typeof BabelCore;

export interface TailwindReactNativeOptions {
  tailwindConfigPath?: string;
  platform?: "web" | "native" | "native-context" | "native-inline";
  allowedImports?: "*" | Array<string | RegExp>;
  deniedImports?: Array<string | RegExp>;
}

export type State = {
  get: (name: string) => any;
  set: (name: string, value: any) => any;
  opts: TailwindReactNativeOptions;
  file: BabelCore.BabelFile;
  filename: string;
};
