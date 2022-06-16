import { ViewStyle, TextStyle, ImageStyle } from "react-native";

export type AllowPathOptions = "*" | string[];

export interface TailwindcssReactNativeBabelOptions {
  allowModuleTransform?: AllowPathOptions;
  blockModuleTransform?: string[];
  platform?: "web" | "native";
  mode?: "compileAndTransform" | "compileOnly" | "transformOnly";
  rem?: number;
  tailwindConfigPath?: string;
}

export type State = {
  get: (name: string) => any;
  set: (name: string, value: any) => any;
  opts: TailwindcssReactNativeBabelOptions;
  file: BabelCore.BabelFile;
  filename: string;
};
