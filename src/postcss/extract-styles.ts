import { TailwindConfig } from "tailwindcss/tailwind-config";
import postcss from "postcss";
import tailwind from "tailwindcss";

import plugin from "../postcss";

import { StyleError, StyleRecord } from "../types/common";

export interface ExtractStylesOptions<T> extends TailwindConfig {
  serializer: (styleRecord: StyleRecord) => T;
}

export interface ExtractStyles<T> {
  output: T;
  errors: StyleError[];
}

export function extractStyles<T>(
  { serializer, ...tailwindConfig }: ExtractStylesOptions<T>,
  cssInput = "@tailwind components;@tailwind utilities;"
): ExtractStyles<T> {
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
    output: serializer(styles),
    errors,
  };
}
