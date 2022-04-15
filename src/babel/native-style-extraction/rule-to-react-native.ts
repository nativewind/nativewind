import { AtRule, Comment, Page, Rule } from "css";
import {
  getPropertyName,
  getStylesForProperty,
  Style,
} from "css-to-react-native";

import { isInvalidStyle } from "./is-valid-style";
import { postProcessingCssFn } from "./postprocessing";

export function ruleToReactNative({ declarations = [] }: Rule | Page): Style {
  const style: Style = {};

  for (const declaration of declarations) {
    if (isComment(declaration)) {
      continue;
    }

    let { property: cssAttribute, value: cssValue } = declaration;

    if (cssAttribute === undefined || cssValue === undefined) {
      continue;
    }

    const nativeStyles = getStylesForProperty(
      getPropertyName(cssAttribute),
      cssValue
    );

    for (const [nativeAttribute, nativeValue] of Object.entries(nativeStyles)) {
      if (isInvalidStyle(nativeAttribute, nativeValue)) {
        warnInvalidStyle(cssAttribute, nativeAttribute, nativeValue);
        continue;
      }

      if (postProcessingCssFn[nativeAttribute]) {
        const postprocessedValue =
          postProcessingCssFn[nativeAttribute](nativeValue);

        if (postprocessedValue === null) {
          warnInvalidStyle(cssAttribute, nativeAttribute, nativeValue);
        } else {
          style[nativeAttribute] = postprocessedValue;
        }
      } else {
        style[nativeAttribute] = nativeValue;
      }
    }
  }

  return style;
}

function warnInvalidStyle(selector: string, attribute: string, value: unknown) {
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      `Class name '${selector}' maps to invalid style {${attribute}: ${value}}`
    );
  } else if (process.env.NODE_ENV !== "test") {
    console.warn(`Class name '${selector}' is being ignored as it produces an invalid React Native style { ${attribute}: '${value}' }
Either remove this selector, add a platform modifier (e.g. 'web:${selector}') or change to file to be platform specific.
`);
  }
}

function isComment(rule: Rule | Comment | AtRule): rule is Comment {
  return rule.type === "comment";
}
