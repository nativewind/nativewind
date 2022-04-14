import { MediaRecord, StyleRecord } from "../types";

import css from "css";
import postcss from "postcss";
import tailwind from "tailwindcss";
import postcssCssvariables from "postcss-css-variables";
import postcssColorRBG from "postcss-color-rgb";

import { flattenRules } from "./flatten-rules";
import { TailwindConfig } from "tailwindcss/tailwind-config";

export function processStyles(
  tailwindConfig: TailwindConfig,
  cssInput: string = "@tailwind components;@tailwind utilities;"
) {
  const processedCss = postcss([
    tailwind(tailwindConfig),
    postcssCssvariables(),
    postcssColorRBG(),
  ]).process(cssInput).css;

  const cssRules = css.parse(processedCss).stylesheet?.rules ?? [];

  const parsedRules = flattenRules(cssRules, tailwindConfig);

  const styles: StyleRecord = {};
  const mediaRules: MediaRecord = {};

  for (const [suffix, parsedRule] of parsedRules.entries()) {
    const { selector, media, rules } = parsedRule;

    if (media.length > 0) {
      // If there are media conditions, add the rules with an uffix
      styles[`${selector}_${suffix}`] = rules;
      // Store the conditions, along with the suffix
      mediaRules[selector] = mediaRules[selector] ?? [];
      mediaRules[selector].push({ media, suffix });
    } else {
      // If there are no conditions, we merge the rules
      // Lower rules should overwrite
      styles[selector] = {
        ...(styles[selector] ?? {}),
        ...rules,
      };
    }
  }

  return {
    styles,
    media: mediaRules,
  };
}
