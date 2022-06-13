import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";

import plugin from "../postcss";

import { StyleError, StyleRecord } from "../types/common";

export interface ExtractStylesOptions<T> extends Config {
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
    tailwind(tailwindConfig as Config),
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
