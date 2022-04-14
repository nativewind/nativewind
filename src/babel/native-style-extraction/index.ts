import { MediaRecord, StyleRecord } from "../types";

import postcss from "postcss";
import tailwind from "tailwindcss";
import postcssCssvariables from "postcss-css-variables";
import postcssColorRBG from "postcss-color-rgb";

import { getParsedRules } from "./get-parsed-rules";
import { TailwindConfig } from "tailwindcss/tailwind-config";

export function extractStyles(
  tailwindConfig: TailwindConfig,
  cssInput: string = "@tailwind components;@tailwind utilities;"
) {
  const processedCss = postcss([
    tailwind(tailwindConfig),
    postcssCssvariables(),
    postcssColorRBG(),
  ]).process(cssInput).css;

  const styles: StyleRecord = {};
  const mediaRules: MediaRecord = {};

  const parsedRules = getParsedRules(processedCss, tailwindConfig);

  for (const [suffix, parsedRule] of parsedRules.entries()) {
    const { selector, media, style } = parsedRule;

    if (media.length > 0) {
      // If there are media conditions, add the rules with an uffix
      styles[`${selector}_${suffix}`] = style;
      // Store the conditions, along with the suffix
      mediaRules[selector] = mediaRules[selector] ?? [];
      mediaRules[selector].push({ media, suffix });
    } else {
      // If there are no conditions, we merge the rules
      // Lower rules should overwrite
      styles[selector] = {
        ...(styles[selector] ?? {}),
        ...style,
      };
    }
  }

  return {
    styles,
    media: mediaRules,
  };
}
