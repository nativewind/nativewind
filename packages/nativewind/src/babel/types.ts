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
