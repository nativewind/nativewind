import { AtRule, Comment, Page, Rule } from "css";
import {
  getPropertyName,
  getStylesForProperty,
  Style,
} from "css-to-react-native";

import { isInvalidStyle } from "./is-valid-style";
import { postProcessingCssFn, preProcessingCssFn } from "./patches";

/**
 * Convert a css rule to react-native.
 *
 * The heavy lifting is performed by 'css-to-react-native', but this comes with some quirks
 *
 * CTRN only accepts __valid__ css that can be mapped 1-1 to RN. Invalid CSS will
 * produce warnings in the console.
 *
 * This library is more friendly and fixes what it can / produces better warnings.
 *
 * Hence why we have pre/post processing.
 *
 * - Pre fixes so CTRN can process it (or it skips processing altogether)
 * - Post fixes the result of CTRN (or it skips the value)
 */
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

    const name = getPropertyName(cssAttribute);

    const value = preProcessingCssFn[name]
      ? preProcessingCssFn[name](cssValue)
      : cssValue;

    if (value === null) {
      warnInvalidStyle(cssAttribute, name, value);
      continue;
    }

    const nativeStyles = getStylesForProperty(name, value);

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
