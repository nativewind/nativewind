import { BabelFile } from "@babel/core";
import type { Config } from "tailwindcss";

export type AllowPathOptions = "*" | string[];

export interface TailwindcssReactNativeBabelOptions {
  allowModuleTransform?: AllowPathOptions;
  blockModuleTransform?: string[];
  mode?: "compileAndTransform" | "compileOnly" | "transformOnly";
  rem?: number;
  tailwindConfigPath?: string;
  tailwindConfig?: Config | undefined;
}

export type State = {
  opts: TailwindcssReactNativeBabelOptions;
  file: BabelFile;
  filename: string;
};
