import type { Visitor } from "@babel/traverse";

import { getImportBlockedComponents } from "./utils/get-import-blocked-components";
import { someAttributes } from "./utils/has-attribute";

import { AllowPathOptions, TailwindcssReactNativeBabelOptions } from "./types";

import {
  Expression,
  identifier,
  isJSXIdentifier,
  isJSXMemberExpression,
  jSXAttribute,
  jsxClosingElement,
  JSXElement,
  jsxElement,
  jsxExpressionContainer,
  JSXIdentifier,
  jSXIdentifier,
  jsxIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement,
  jsxOpeningElement,
  memberExpression,
} from "@babel/types";
import { PluginPass } from "@babel/core";

export interface VisitorState extends PluginPass {
  opts: TailwindcssReactNativeBabelOptions;
  filename: string;
  allowModuleTransform: AllowPathOptions;
  allowRelativeModules: AllowPathOptions;
  blockList: Set<string>;
  canCompile: boolean;
  canTransform: boolean;
  didTransform: boolean;
}

export const visitor: Visitor<VisitorState> = {
  ImportDeclaration(path, state) {
    for (const component of getImportBlockedComponents(path, state)) {
      state.blockList.add(component);
    }
  },
  JSXElement: {
    exit: (path, state) => {
      const { blockList, canTransform } = state;

      if (
        isWrapper(path.node) ||
        !canTransform ||
        !someAttributes(path, ["className", "tw"])
      ) {
        return;
      }

      const name = getElementName(path.node.openingElement);

      if (blockList.has(name) || name[0] !== name[0].toUpperCase()) {
        return;
      }

      state.didTransform ||= true;

      path.replaceWith(
        jsxElement(
          jsxOpeningElement(jsxIdentifier("_StyledComponent"), [
            ...path.node.openingElement.attributes,
            jSXAttribute(
              jSXIdentifier("component"),
              jsxExpressionContainer(
                toExpression(path.node.openingElement.name)
              )
            ),
          ]),
          jsxClosingElement(jsxIdentifier("_StyledComponent")),
          path.node.children
        )
      );
    },
  },
};

function isWrapper(node: JSXElement) {
  const nameNode = node.openingElement.name;
  if (isJSXIdentifier(nameNode)) {
    return (
      nameNode.name === "_StyledComponent" ||
      nameNode.name === "StyledComponent"
    );
  } else if (isJSXMemberExpression(nameNode)) {
    return (
      nameNode.property.name === "_StyledComponent" ||
      nameNode.property.name === "StyledComponent"
    );
  } else {
    return false;
  }
}

function getElementName({ name }: JSXOpeningElement): string {
  if (isJSXIdentifier(name)) {
    return name.name;
  } else if (isJSXMemberExpression(name)) {
    return name.property.name;
  } else {
    // https://github.com/facebook/jsx/issues/13#issuecomment-54373080
    throw new Error("JSXNamespacedName is not supported by React JSX");
  }
}

function toExpression(
  node: JSXIdentifier | JSXMemberExpression | JSXNamespacedName
): Expression {
  if (isJSXIdentifier(node)) {
    return identifier(node.name);
  } else if (isJSXMemberExpression(node)) {
    return memberExpression(
      toExpression(node.object),
      toExpression(node.property)
    );
  } else {
    // https://github.com/facebook/jsx/issues/13#issuecomment-54373080
    throw new Error("JSXNamespacedName is not supported by React JSX");
  }
}
