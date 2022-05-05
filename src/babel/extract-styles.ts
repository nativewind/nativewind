import { TailwindConfig } from "tailwindcss/tailwind-config";
import postcss from "postcss";
import tailwind from "tailwindcss";

import plugin from "../postcss";

import { MediaRecord, StyleError, StyleRecord } from "../types/common";

export function extractStyles(
  tailwindConfig: TailwindConfig,
  cssInput = "@tailwind components;@tailwind utilities;"
) {
  let styles: StyleRecord = {};
  let media: MediaRecord = {};
  let errors: StyleError[] = [];

  const plugins = [
    tailwind(tailwindConfig),
    plugin({
      ...tailwindConfig,
      done: (output) => {
        styles = output.styles;
        media = output.media;
        errors = output.errors;
      },
    }),
  ];

  postcss(plugins).process(cssInput).css;

  return {
    styles,
    media,
    errors,
  };
}
