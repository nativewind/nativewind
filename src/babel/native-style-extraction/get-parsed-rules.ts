import { parse, AtRule, Comment, Declaration, Media, Page, Rule } from "css";
import cssToReactNative from "css-to-react-native";
import { TailwindConfig } from "tailwindcss/tailwind-config";

import { normaliseSelector } from "../../shared/selector";
import { Style } from "../types";
import { isValidStyle } from "./is-valid-style";
import { postProcessingCssFn } from "./postprocessing";

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
      const { style, invalidStyleProps } = getStyles(cssRule);

      if (!style) {
        continue;
      }

      if (process.env.NODE_ENV === "production") {
        throw new Error(
          `Selectors ${cssRule.selectors} are invalid for React Native`
        );
      } else {
        if (invalidStyleProps.length > 0) {
          console.warn(`
Selectors ${cssRule.selectors} use invalid styles ${invalidStyleProps}.

Either remove these selectors or change to file to be platform specific (eg compoent.web.js)
            `);
        }
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

function getStyles({ declarations }: Rule | Page): {
  style: Style | null;
  invalidStyleProps: string[];
} {
  const invalidStyleProps: string[] = [];

  const ruleTuples = [...declarationRuleTupleIterator(declarations)];

  if (ruleTuples.length === 0) {
    return { style: null, invalidStyleProps };
  }

  const style = cssToReactNative(ruleTuples);

  const styleEntries = Object.entries(style).flatMap(([prop, value]) => {
    if (isValidStyle(prop, value)) {
      if (postProcessingCssFn[prop]) {
        const postprocessedValue = postProcessingCssFn[prop](value);

        if (postprocessedValue === null) {
          invalidStyleProps.push(prop);
          return [];
        } else {
          return [[prop, postprocessedValue]];
        }
      } else {
        return [[prop, value]];
      }
    } else {
      invalidStyleProps.push(prop);
      return [];
    }
  });

  if (styleEntries.length === 0) {
    return { style: null, invalidStyleProps };
  }

  return {
    style: Object.fromEntries(styleEntries),
    invalidStyleProps,
  };
}

function* declarationRuleTupleIterator(
  declarations: (Comment | Declaration)[] = []
): Generator<[string, string]> {
  for (const declaration of declarations) {
    if (isComment(declaration)) {
      continue;
    }

    let { property, value } = declaration;

    if (property === undefined || value === undefined) {
      continue;
    }

    yield [property, value];
  }
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
