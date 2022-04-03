const cssToReactNative = require("css-to-react-native").default;
const normaliseSelector = require("../../../dist/shared/selector");

/** @typedef {import('react-native').ViewStyle | import('react-native').TextStyle | import('react-native').ImageStyle} Style */
/** @typedef {{ selector: string, media: string[], rules: Style, rulesAst: any }} CssRule */

/**
 * Flattens StyleRules from the 'css' package
 *  - spreads selectors into multiple entries
 *  - flattens media rules so they are not nested
 *  - flattens styles to be react-native style objects
 * @param {import('@types/css').StyleRules["rules"]} cssRules
 * @param {{ important?: string }} options
 * @param {Array<string> | undefined} media
 * @returns {Array<CssRule>}
 */
function flattenRules(t, cssRules, options, media = []) {
  return cssRules.flatMap((cssRule) => {
    if (cssRule.type === "media") {
      return flattenRules(t, cssRule.rules, options, [
        ...new Set([...media, cssRule.media]),
      ]);
    } else if (cssRule.type === "rule") {
      const declarationRuleTuples = [];

      for (const { type, property, value } of cssRule.declarations || []) {
        if (type !== "declaration") {
          continue;
        }
        declarationRuleTuples.push([property, value]);
      }

      if (declarationRuleTuples.length === 0) {
        return;
      }

      const rules = cssToReactNative(declarationRuleTuples);

      /** @type {Array<CssRule>} */
      const selectors = (cssRule.selectors || []).map((selectorDirty) => {
        const selector = normaliseSelector(selectorDirty, options);

        return {
          selector,
          media,
          rules,
        };
      });

      return selectors;
    } else {
      return [];
    }
  });
}

module.exports = flattenRules;
