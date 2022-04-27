import { ViewStyle, TextStyle, ImageStyle } from "react-native";

export type PathOption = string;
export type AllowPathOptions = "*" | PathOption[];

export interface TailwindReactNativeOptions {
  allowModules?: AllowPathOptions;
  blockModules?: PathOption[];
  platform?: "web" | "native";
  skipTransform?: false;
  rem?: number;
  tailwindConfigPath?: string;
  hmr?: boolean;
}

export type State = {
  get: (name: string) => any;
  set: (name: string, value: any) => any;
  opts: TailwindReactNativeOptions;
  file: BabelCore.BabelFile;
  filename: string;
};
