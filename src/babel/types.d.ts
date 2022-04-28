import { ViewStyle, TextStyle, ImageStyle } from "react-native";

export type AllowPathOptions = "*" | string[];

export interface TailwindcssReactNativeBabelOptions {
  allowModules?: AllowPathOptions;
  blockModules?: string[];
  platform?: "web" | "native";
  skipTransform?: false;
  rem?: number;
  tailwindConfigPath?: string;
  hmr?: boolean;
}

export type State = {
  get: (name: string) => any;
  set: (name: string, value: any) => any;
  opts: TailwindcssReactNativeBabelOptions;
  file: BabelCore.BabelFile;
  filename: string;
};
