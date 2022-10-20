/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable unicorn/prefer-module */
import { resolve } from "node:path";
import resolveConfig from "tailwindcss/resolveConfig";
import resolveConfigPath from "tailwindcss/lib/util/resolveConfigPath";
import { validateConfig } from "tailwindcss/lib/util/validateConfig";
import { normalizePath } from "./normalize-path";

import type { ConfigAPI, NodePath, PluginPass, Visitor } from "@babel/core";
import micromatch from "micromatch";
import { addNamed, addSideEffect } from "@babel/helper-module-imports";

// import { getImportBlockedComponents } from "./get-import-blocked-components";
// const allowModuleTransform = Array.isArray(options.allowModuleTransform)
//   ? ["react-native", "react-native-web", ...options.allowModuleTransform]
//   : "*";

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
import { Config } from "tailwindcss";

export interface PluginOptions {
  isInContent?: boolean;
  didTransform?: boolean;
  allowModuleTransform?: "*" | string[];
  blockModuleTransform?: string[];
  mode?: "compileAndTransform" | "compileOnly" | "transformOnly";
  tailwindConfigPath?: string;
  tailwindConfig?: Config | undefined;
  cwd: string;
}

export function plugin(api: ConfigAPI, options: PluginOptions) {
  const { cwd = process.cwd() } = options;
  const tailwindConfig = resolveTailwindConfig(api, options);

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
      opts: PluginOptions;
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

function resolveTailwindConfig(_: ConfigAPI, options: PluginOptions): Config {
  let tailwindConfig: Config;

  const userConfigPath = resolveConfigPath(
    options.tailwindConfig || options.tailwindConfigPath
  );

  if (userConfigPath === null) {
    tailwindConfig = resolveConfig(options.tailwindConfig);
  } else {
    delete require.cache[require.resolve(userConfigPath)];
    const newConfig = resolveConfig(require(userConfigPath));
    tailwindConfig = validateConfig(newConfig);
  }

  const hasPreset = tailwindConfig.presets?.some((preset) => {
    return (
      (typeof preset === "object" || typeof preset === "function") &&
      ("nativewind" in preset ||
        ("default" in preset && "nativewind" in preset["default"]))
    );
  });

  if (!hasPreset) {
    throw new Error("NativeWind preset was not included");
  }

  return tailwindConfig;
}
