import { parse, AtRule, Comment, Media, Rule } from "css";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { normaliseSelector } from "../../shared/selector";
import { Style } from "../types";
import { ruleToReactNative } from "./rule-to-react-native";

interface CssRule {
  selector: string;
  media: string[];
  style: Style;
}

/**
 * Iterators over a CSS file, converting the rules to React Native styles.
 *
 * @remarks
 *
 * It will flatten selectors there are no grouped selectors
 * It will flattern media queries so they are not nested
 */
export function getParsedRules(
  css: string,
  tailwindConfig: TailwindConfig
): CssRule[] {
  const cssRules = parse(css).stylesheet?.rules ?? [];
  return [...cssRuleIterator(cssRules, tailwindConfig)];
}

function* cssRuleIterator(
  cssRules: (Rule | Comment | AtRule)[] | undefined,
  tailwindConfig: TailwindConfig,
  media: string[] = []
): Generator<CssRule> {
  for (const cssRule of cssRules ?? []) {
    if (isMedia(cssRule)) {
      let childMedia = media;

      if (cssRule.media && !childMedia.includes(cssRule.media)) {
        childMedia = [...media, cssRule.media];
      }

      yield* cssRuleIterator(cssRule.rules ?? [], tailwindConfig, childMedia);
    } else if (isRule(cssRule)) {
      const style = ruleToReactNative(cssRule);

      if (Object.keys(style).length === 0) {
        continue;
      }

      for (const selector of cssRule.selectors ?? []) {
        yield {
          selector: normaliseSelector(selector, tailwindConfig),
          media,
          style,
        };
      }
    }
  }
}

function isRule(rule: Rule | Comment | AtRule): rule is Rule {
  return rule.type === "rule";
}

function isMedia(rule: Rule | Comment | AtRule): rule is Media {
  return rule.type === "media";
}
