const css = require("css");
const postcss = require("postcss");
const tailwind = require("tailwindcss");
const postcssCssvariables = require("postcss-css-variables");
const postcssColorRBG = require("postcss-color-rgb");
const postcssRemToPixel = require("postcss-rem-to-pixel");
const serialize = require("babel-literal-to-ast");
const flattenRules = require("./flatten-rules");
const normaliseSelector = require("../../../dist/shared/selector");

/** @typedef {import('react-native').ViewStyle | import('react-native').TextStyle | import('react-native').ImageStyle} Style */

function processStyles({ types: t }, tailwindConfig) {
  const cssInput = "@tailwind utilities";

  /** @type {string} */
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

  const cssRules = css.parse(processedCss).stylesheet.rules;

  const parsedRules = flattenRules(t, cssRules, tailwindConfig);

  /** @type {Record<string, Style>} */
  const styles = {};
  /** @type {Record<string, Array<{ media: string, suffix: number>} */
  const mediaRules = {};

  for (const [
    suffix,
    { selector, media, rules } = {},
  ] of parsedRules.entries()) {
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
    styles: serialize(styles),
    media: serialize(mediaRules),
  };
}

module.exports = processStyles;
