import cssToReactNative from "css-to-react-native";
import { TailwindConfig } from "tailwindcss/tailwind-config";
import { AtRule, Comment, Media, Rule, StyleRules } from "css";

import { normaliseSelector } from "../../shared/selector";
import { Style } from "../types";

import { isValidStyle } from "./is-valid-style";
import { postProcessingCssFn } from "./postprocessing-css";

interface CssRule {
  selector: string;
  media: string[];
  rules: Style;
}

/**
 * Flattens StyleRules from the 'css' package
 *  - spreads selectors into multiple entries
 *  - flattens media rules so they are not nested
 *  - flattens styles to be react-native style objects
 */
export function flattenRules(
  cssRules: StyleRules["rules"],
  tailwindConfig: TailwindConfig,
  media: string[] = []
): CssRule[] {
  return cssRules.flatMap((cssRule) => {
    if (isMedia(cssRule)) {
      return flattenRules(cssRule.rules ?? [], tailwindConfig, [
        ...new Set(cssRule.media ? [...media, cssRule.media] : media),
      ]);
    } else if (isRule(cssRule)) {
      const declarationRuleTuples: [string, string | number | undefined][] = [];
      const invalidStyleProps: string[] = [];

      for (const declaration of cssRule.declarations || []) {
        if (isComment(declaration)) {
          continue;
        }

        let { property, value } = declaration;

        if (property === undefined || value === undefined) {
          continue;
        }

        declarationRuleTuples.push([property, value]);
      }

      if (declarationRuleTuples.length === 0) {
        return [];
      }

      const rules = Object.fromEntries(
        Object.entries(cssToReactNative(declarationRuleTuples as any)).flatMap<
          [string, string | number | Style | undefined]
        >(([prop, value]) => {
          if (isValidStyle(prop, value)) {
            if (postProcessingCssFn[prop]) {
              return [[prop, postProcessingCssFn[prop](value)]];
            } else {
              return [[prop, value]];
            }
          } else {
            invalidStyleProps.push(prop);
            return [];
          }
        })
      );

      if (
        process.env.NODE_ENV !== "development" &&
        process.env.NODE_ENV !== "test"
      ) {
        if (invalidStyleProps.length > 0) {
          console.warn(
            `Selectors ${cssRule.selectors} use invalid styles ${invalidStyleProps}`
          );
          console.warn(
            `Either remove these selectors or change to file to be platform specific (eg compoent.web.js)`
          );
        }
      }

      if (Object.keys(rules).length === 0) {
        return [];
      }

      const selectors: CssRule[] = (cssRule.selectors || []).map(
        (selectorDirty) => {
          const selector = normaliseSelector(selectorDirty, tailwindConfig);

          return {
            selector,
            media,
            rules,
          };
        }
      );

      return selectors;
    } else {
      return [];
    }
  });
}

function isRule(rule: Rule | Comment | AtRule): rule is Rule {
  return rule.type === "rule";
}

function isComment(rule: Rule | Comment | AtRule): rule is Comment {
  return rule.type === "comment";
}

function isMedia(rule: Rule | Comment | AtRule): rule is Media {
  return rule.type === "media";
}
