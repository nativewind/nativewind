import { NodePath } from "@babel/core";
import { Expression, JSXOpeningElement } from "@babel/types";
import { Babel } from "../types";

import {
  createMergedStylesExpressionContainer,
  getStyleAttributesAndValues,
} from "../utils/jsx";

export interface ClassNameToStyleOptions {
  inlineStyles: boolean;
}

export function classNameToStyle(
  babel: Babel,
  path: NodePath<JSXOpeningElement>,
  { inlineStyles }: ClassNameToStyleOptions
): boolean {
  const {
    className: existingClassName,
    classNameAttribute: existingClassNameAttribute,
    styleAttribute: existingStyleAttribute,
    style: existingStyle,
  } = getStyleAttributesAndValues(babel, path);

  /**
   * If we didn't find any classNames, return early
   */
  if (!existingClassName) {
    return false;
  }

  /**
   * Remove the existing attributes, we are going to add a new ones
   */
  existingClassNameAttribute?.remove();
  existingStyleAttribute?.remove();

  /**
   * If there are existing styles we need to merge them
   *
   * Classnames have lower specificity than inline styles
   * so they should always be first
   */
  const { types: t } = babel;
  const callExpressionArguments: Array<Expression> = inlineStyles
    ? [
        existingClassName,
        t.objectExpression([
          t.objectProperty(
            t.identifier("styles"),
            t.identifier("__tailwindStyles")
          ),
          t.objectProperty(
            t.identifier("media"),
            t.identifier("__tailwindMedia")
          ),
        ]),
      ]
    : [existingClassName];

  const hookExpression = t.callExpression(
    t.identifier("useTailwind"),
    callExpressionArguments
  );

  const newStyleExpression = createMergedStylesExpressionContainer(
    babel,
    hookExpression,
    existingStyle
  );

  path.node.attributes.push(
    t.jSXAttribute(t.jSXIdentifier("style"), newStyleExpression)
  );

  return true;
}
