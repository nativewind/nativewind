import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";
import { NativeWindStyleSheet } from "../src";
import { getCreateOptions } from "../src/transform-css";
import nativePreset from "../src/tailwind";

export function extractStyles(tailwindConfig: Config, cssInput: string) {
  const css = postcss([tailwind(tailwindConfig)]).process(cssInput).css;
  // console.log(css);
  return getCreateOptions(css);
}

export interface CreateOptions {
  css?: string;
  theme?: Config["theme"];
}

export function create(className: string, { css, theme }: CreateOptions = {}) {
  return NativeWindStyleSheet.create(
    extractStyles(
      {
        content: [],
        safelist: [className, ...nativePreset.safelist],
        presets: [nativePreset],
        theme,
      },
      `@tailwind base;@tailwind components;@tailwind utilities;${css ?? ""}`
    )
  );
}
