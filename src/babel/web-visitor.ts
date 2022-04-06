import type { Visitor } from "@babel/traverse";
import { Babel, State } from "./types";
import {
  createMergedStylesExpressionContainer,
  getJSXElementName,
  getStyleAttributesAndValues,
} from "./utils/jsx";

export interface WebVisitorState extends State {
  babel: Babel;
}

export const webVisitor: Visitor<WebVisitorState> = {
  JSXOpeningElement(path, state) {
    try {
      const { types: t } = state.babel;

      const name = getJSXElementName(path.node);
      const firstCharOfName = name[0];

      // Ignore elements that start in lower case
      if (
        firstCharOfName &&
        firstCharOfName === firstCharOfName.toLowerCase()
      ) {
        return;
      }

      const {
        className: existingClassName,
        classNameAttribute: existingClassNameAttribute,
        styleAttribute: existingStyleAttribute,
        style: existingStyle,
      } = getStyleAttributesAndValues(state.babel, path);

      /**
       * If we didn't find any classNames, return early
       */
      if (!existingClassName) {
        return;
      }

      /**
       * Remove the existing attributes, we are going to add a new ones
       */
      existingClassNameAttribute?.remove();
      existingStyleAttribute?.remove();

      /**
       * Convert the classNames into a compiled style object
       */
      let newStyle = t.objectExpression([
        t.objectProperty(t.identifier("$$css"), t.booleanLiteral(true)),
        t.objectProperty(
          t.identifier("tailwindcssReactNative"),
          existingClassName
        ),
      ]);

      const newStyleExpression = createMergedStylesExpressionContainer(
        state.babel,
        newStyle,
        existingStyle
      );

      path.node.attributes.push(
        t.jSXAttribute(t.jSXIdentifier("style"), newStyleExpression)
      );
    } catch (error) {
      throw error;
    }
  },
};
