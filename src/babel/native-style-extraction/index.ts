import { TailwindConfig } from "tailwindcss/tailwind-config";
import postcss from "postcss";
import tailwind from "tailwindcss";
import postcssCssvariables from "postcss-css-variables";
import postcssColorFunctionalNotation from "postcss-color-functional-notation";
import calc from "postcss-calc";

import { plugin } from "../../postcss";
import { MediaRecord, StyleError, StyleRecord } from "../../types/common";

/**
 * This is used by both Babel and the CLI to extract the files
 *
 * The CLI watches the TailwindCLI output, so you don't need
 * to use the tailwind plugin
 */
export function extractStyles(
  tailwindConfig: TailwindConfig,
  cssInput = "@tailwind components;@tailwind utilities;",
  includeTailwind = true
) {
  let styles: StyleRecord = {};
  let media: MediaRecord = {};
  let errors: StyleError[] = [];

  const plugins = [
    postcssCssvariables({
      variables: {
        "tw-translate-x": 0,
        "tw-translate-y": 0,
        "tw-rotate": "0deg",
        "tw-skew-x": "0deg",
        "tw-skew-y": "0deg",
        "tw-scale-x": 0,
        "tw-scale-y": 0,
      },
    }),
    postcssColorFunctionalNotation(),
    calc({
      warnWhenCannotResolve: true,
    }),
    plugin({
      ...tailwindConfig,
      done: (output) => {
        styles = output.styles;
        media = output.media;
        errors = output.errors;
      },
    }),
  ];

  if (includeTailwind) {
    plugins.unshift(tailwind(tailwindConfig));
  }

  postcss(plugins).process(cssInput).css;

  return {
    styles,
    media,
    errors,
  };
}
