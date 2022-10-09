import type { ConfigAPI, NodePath, PluginPass, Visitor } from "@babel/core";
import micromatch from "micromatch";
import { addNamed, addSideEffect } from "@babel/helper-module-imports";

import { TailwindcssReactNativeBabelOptions } from ".";

import {
  Expression,
  identifier,
  isJSXAttribute,
  isJSXIdentifier,
  isJSXMemberExpression,
  isJSXSpreadAttribute,
  jSXAttribute,
  jsxClosingElement,
  jsxElement,
  JSXElement,
  jsxExpressionContainer,
  jsxIdentifier,
  jSXIdentifier,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  jsxOpeningElement,
  memberExpression,
} from "@babel/types";
import { normalizePath } from "./normalize-path";

export interface PluginOptions {
  contentFilePaths: string[];
}

export function plugin(_: ConfigAPI, { contentFilePaths }: PluginOptions) {
  const programVisitor: Visitor<
    PluginPass & {
      opts: TailwindcssReactNativeBabelOptions;
    }
  > = {
    Program: {
      enter(path, state) {
        const filename = state.filename;
        if (!filename) return;

        state.blockList = new Set();
        state.isInContent = micromatch.isMatch(
          normalizePath(filename),
          contentFilePaths
        );

        path.traverse({
          ImportDeclaration(path) {
            if (path.node.source.value.endsWith(".css")) {
              path.remove();
            }
          },
          CallExpression(path) {
            const callee = path.get("callee");
            if (!callee.isIdentifier() || !callee.equals("name", "require")) {
              return;
            }

            const argument = path.get("arguments")[0];
            if (!argument || !argument.isStringLiteral()) {
              return;
            }

            if (argument.node.value.endsWith(".css")) {
              path.remove();
            }
          },
        });
      },
      exit(path, state) {
        if (state.didTransform) {
          addNamed(path, "StyledComponent", "nativewind");
        }

        if (
          state.filename?.endsWith("nativewind/dist/index.js") &&
          process.env.NATIVEWIND_OUTPUT
        ) {
          addSideEffect(path, process.env.NATIVEWIND_OUTPUT);
        }
      },
    },
    JSXElement(path, state) {
      if (!state.isInContent || !state.filename) return;

      const blockList = state.blockList as Set<string>;

      const namePath = path.get("openingElement").get("name");

      const name = namePath.isJSXIdentifier()
        ? namePath.node.name
        : namePath.isJSXMemberExpression()
        ? namePath.node.property.name
        : undefined;

      const isWrapper =
        name === "_StyledComponent" || name === "StyledComponent";

      if (
        !someAttributes(path, ["className", "tw"]) ||
        !name ||
        isWrapper ||
        blockList?.has(name) ||
        name[0] !== name[0].toUpperCase()
      ) {
        return;
      }

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
      state.didTransform = true;
    },
  };

  return {
    visitor: programVisitor,
  };
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

function someAttributes(path: NodePath<JSXElement>, names: string[]) {
  return path.node.openingElement.attributes.some((attribute) => {
    /**
     * I think we should be able to process spread attributes
     * by checking their binding, but I still learning how this works
     *
     * If your reading this and understand Babel bindings please send a PR
     */
    if (isJSXSpreadAttribute(attribute)) {
      return false;
    }

    return names.some((name) => {
      return (
        isJSXAttribute(attribute) && isJSXIdentifier(attribute.name, { name })
      );
    });
  });
}
