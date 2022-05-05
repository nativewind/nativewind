import { TailwindConfig } from "tailwindcss/tailwind-config";
import postcss from "postcss";
import tailwind from "tailwindcss";

import plugin from "../../postcss";

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
