import { MediaRecord, Style, StyleRecord } from "../types";

import css from "css";
import postcss from "postcss";
import tailwind from "tailwindcss";
import postcssCssvariables from "postcss-css-variables";
import postcssColorRBG from "postcss-color-rgb";
import postcssRemToPixel from "postcss-rem-to-pixel";

import { flattenRules } from "./flatten-rules";
import { normaliseSelector } from "../../shared/selector";
import { TailwindConfig } from "tailwindcss/tailwind-config";

export function processStyles(
  tailwindConfig: TailwindConfig,
  cssInput: string = "@tailwind components;@tailwind utilities;"
) {
  const processedCss = postcss([
    tailwind(tailwindConfig),
    postcssCssvariables(),
    postcssColorRBG(),
    postcssRemToPixel({
      rootValue: 16,
      propList: [
        "font",
        "font-size",
        "line-height",
        "letter-spacing",
        "margin",
      ],
      replace: true,
      mediaQuery: true,
      minRemValue: 0,
    }),
  ]).process(cssInput).css;

  const cssRules = css.parse(processedCss).stylesheet?.rules ?? [];

  const parsedRules = flattenRules(cssRules, tailwindConfig);

  const styles: StyleRecord = {};
  const mediaRules: MediaRecord = {};

  for (const [suffix, parsedRule] of parsedRules.entries()) {
    const { selector, media, rules } = parsedRule;

    const normalisedSelector = normaliseSelector(selector, tailwindConfig);

    if (media.length > 0) {
      // If there are media conditions, add the rules with an uffix
      styles[`${normalisedSelector}${suffix}`] = rules;
      // Store the conditions, along with the suffix
      mediaRules[normalisedSelector] = mediaRules[normalisedSelector] ?? [];
      mediaRules[normalisedSelector].push({ media, suffix });
    } else {
      // If there are no conditions, we merge the rules
      // Lower rules should overwrite
      styles[normalisedSelector] = {
        ...(styles[normalisedSelector] ?? {}),
        ...rules,
      };
    }
  }

  return {
    styles,
    media: mediaRules,
  };
}
