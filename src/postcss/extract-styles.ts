import postcss from "postcss";
import tailwind, { Config } from "tailwindcss";

import plugin from "../postcss";

import { StyleError } from "../types/common";
import { ExtractedValues } from "./plugin";

export interface ExtractStylesOptions<T> extends Config {
  serializer: (values: ExtractedValues) => T;
}

export type ExtractStyles<T> = T & {
  errors: StyleError[];
};

export function extractStyles<T>(
  { serializer, ...tailwindConfig }: ExtractStylesOptions<T>,
  cssInput = "@tailwind components;@tailwind utilities;"
): ExtractStyles<T> {
  let errors: StyleError[] = [];

  let output: ExtractedValues = {
    styles: {},
    topics: {},
    masks: {},
    atRules: {},
  };

  const plugins = [
    tailwind(tailwindConfig as Config),
    plugin({
      ...tailwindConfig,
      done: ({ errors: resultErrors, ...result }) => {
        output = result;
        errors = resultErrors;
      },
    }),
  ];

  postcss(plugins).process(cssInput).css;

  return {
    ...serializer(output),
    errors,
  };
}
