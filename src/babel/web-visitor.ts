import type { Visitor } from "@babel/traverse";
import { SharedVisitorState } from "./types";
import { getImportBlockedComponents } from "./utils/get-import-blocked-components";
import {
  createMergedStylesExpressionContainer,
  getJSXElementName,
  getStyleAttributesAndValues,
} from "./utils/jsx";

export type WebVisitorState = SharedVisitorState;

export const webVisitor: Visitor<WebVisitorState> = {
  ImportDeclaration(path, state) {
    for (const component of getImportBlockedComponents(path, state)) {
      state.blockList.add(component);
    }
  },
  JSXOpeningElement(path, state) {
    try {
      const { types: t } = state.babel;

      const name = getJSXElementName(path.node);

      if (state.blockList.has(name)) {
        return;
      }

      // Ignore elements that start in lower case
      const firstCharOfName = name[0];
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
