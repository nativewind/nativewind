import { TailwindConfig } from "tailwindcss/tailwind-config";
import postcss from "postcss";
import tailwind from "tailwindcss";
import postcssCssvariables from "postcss-css-variables";
import postcssColorFunctionalNotation from "postcss-color-functional-notation";

import { plugin } from "./postcss-plugin";
import { MediaRecord, StyleRecord } from "../../types/common";

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

  const plugins = [
    postcssCssvariables(),
    postcssColorFunctionalNotation(),
    plugin({
      ...tailwindConfig,
      done: (output) => {
        styles = output.styles;
        media = output.media;
      },
    }),
  ];

  if (includeTailwind) {
    plugins.unshift(tailwind(tailwindConfig));
  }

  // If you edit this, make sure you update the CLI postcss.config.js
  // to include the extra plugins
  postcss(plugins).process(cssInput).css;

  return {
    styles,
    media,
  };
}
