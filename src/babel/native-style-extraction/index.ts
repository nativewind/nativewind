import { TailwindConfig } from "tailwindcss/tailwind-config";
import postcss from "postcss";
import tailwind from "tailwindcss";
import postcssCssvariables from "postcss-css-variables";
import postcssColorFunctionalNotation from "postcss-color-functional-notation";

import { getParsedRules } from "./get-parsed-rules";
import { MediaRecord, StyleRecord } from "../../types/common";

export function extractStyles(
  tailwindConfig: TailwindConfig,
  cssInput = "@tailwind components;@tailwind utilities;"
) {
  // If you edit this, make sure you update the CLI postcss.config.js
  const processedCss = postcss([
    tailwind(tailwindConfig),
    postcssCssvariables(),
    postcssColorFunctionalNotation(),
  ]).process(cssInput).css;

  return cssToRn(processedCss, tailwindConfig);
}

export function cssToRn(processedCss: string, tailwindConfig: TailwindConfig) {
  const styles: StyleRecord = {};
  const mediaRules: MediaRecord = {};

  const parsedRules = getParsedRules(processedCss, tailwindConfig);

  for (const [suffix, parsedRule] of parsedRules.entries()) {
    const { selector, media, style } = parsedRule;

    if (media.length > 0) {
      // If there are media conditions, add the rules with a suffix
      styles[`${selector}_${suffix}`] = style;
      // Store the conditions, along with the suffix
      mediaRules[selector] = mediaRules[selector] ?? [];
      mediaRules[selector].push([media, suffix]);
    } else {
      // If there are no conditions, we merge the rules
      styles[selector] = {
        ...styles[selector],
        ...style,
      };
    }
  }

  return {
    styles,
    media: mediaRules,
  };
}
