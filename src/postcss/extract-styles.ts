import { TailwindConfig } from "tailwindcss/tailwind-config";
import postcss from "postcss";
import tailwind from "tailwindcss";

import plugin from "../postcss";

import { StyleError, StyleRecord } from "../types/common";

export function extractStyles(
  tailwindConfig: TailwindConfig,
  cssInput = "@tailwind components;@tailwind utilities;"
) {
  let styles: StyleRecord = {};
  let errors: StyleError[] = [];

  const plugins = [
    tailwind(tailwindConfig),
    plugin({
      ...tailwindConfig,
      done: (output) => {
        styles = output.styles;
        errors = output.errors;
      },
    }),
  ];

  postcss(plugins).process(cssInput).css;

  return {
    styles,
    errors,
  };
}
