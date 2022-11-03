import { resolve } from "node:path";
import { sep, posix } from "node:path";

import { addNamed } from "@babel/helper-module-imports";
import micromatch from "micromatch";
import { Config } from "tailwindcss";

import {
  ConfigAPI,
  NodePath,
  PluginPass,
  Visitor,
  types as t,
} from "@babel/core";

// import { getImportBlockedComponents } from "./get-import-blocked-components";
// const allowModuleTransform = Array.isArray(options.allowModuleTransform)
//   ? ["react-native", "react-native-web", ...options.allowModuleTransform]
//   : "*";

export interface StyledComponentTransformOptions {
  allowModuleTransform?: "*" | string[];
  blockModuleTransform?: string[];
  mode?: "compileAndTransform" | "compileOnly" | "transformOnly";
  cwd: string;
  tailwindConfig: Config;
}

export function styledComponentTransform(
  _: ConfigAPI,
  options: StyledComponentTransformOptions
) {
  const { cwd = process.cwd(), tailwindConfig } = options;

  const content = Array.isArray(tailwindConfig.content)
    ? tailwindConfig.content.filter(
        (filePath): filePath is string => typeof filePath === "string"
      )
    : tailwindConfig.content.files.filter(
        (filePath): filePath is string => typeof filePath === "string"
      );

  const contentFilePaths = content.map((contentFilePath) =>
    normalizePath(resolve(cwd, contentFilePath))
  );

  const programVisitor: Visitor<
    PluginPass & {
      opts: StyledComponentTransformOptions;
      isInContent?: boolean;
      addedNativeWindImport?: boolean;
    }
  > = {
    Program: {
      enter(_, state) {
        state.blockList = new Set();
      },
    },
    JSXElement(path, state) {
      const filename = state.filename;
      if (!filename) return;

      state.isInContent ??= micromatch.isMatch(
        normalizePath(filename),
        contentFilePaths
      );

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
        t.jsxElement(
          t.jsxOpeningElement(t.jsxIdentifier("_StyledComponent"), [
            ...path.node.openingElement.attributes,
            t.jSXAttribute(
              t.jSXIdentifier("component"),
              t.jsxExpressionContainer(
                toExpression(path.node.openingElement.name)
              )
            ),
          ]),
          t.jsxClosingElement(t.jsxIdentifier("_StyledComponent")),
          path.node.children
        )
      );

      if (!state.addedNativeWindImport) {
        state.addedNativeWindImport = true;
        addNamed(path, "StyledComponent", "nativewind");
      }
    },
  };

  return {
    visitor: programVisitor,
  };
}

function toExpression(
  node: t.JSXIdentifier | t.JSXMemberExpression | t.JSXNamespacedName
): t.Expression {
  if (t.isJSXIdentifier(node)) {
    return t.identifier(node.name);
  } else if (t.isJSXMemberExpression(node)) {
    return t.memberExpression(
      toExpression(node.object),
      toExpression(node.property)
    );
  } else {
    // https://github.com/facebook/jsx/issues/13#issuecomment-54373080
    throw new Error("JSXNamespacedName is not supported by React JSX");
  }
}

function someAttributes(path: NodePath<t.JSXElement>, names: string[]) {
  return path.node.openingElement.attributes.some((attribute) => {
    /**
     * I think we should be able to process spread attributes
     * by checking their binding, but I still learning how this works
     *
     * If your reading this and understand Babel bindings please send a PR
     */
    if (t.isJSXSpreadAttribute(attribute)) {
      return false;
    }

    return names.some((name) => {
      return (
        t.isJSXAttribute(attribute) &&
        t.isJSXIdentifier(attribute.name, { name })
      );
    });
  });
}

export function normalizePath(filePath: string) {
  /**
   * This is my naive way to get path matching working on Windows.
   * Basically I turn it into a posix path which seems to work fine
   *
   * If you are a windows user and understand micromatch, can you please send a PR
   * to do this the proper way
   */
  return filePath.split(sep).join(posix.sep);
}
