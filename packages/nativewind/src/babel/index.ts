import { readFileSync, writeFileSync } from "node:fs";
import { resolve, sep, posix, join, dirname, relative } from "node:path";

import type { ConfigAPI, NodePath, PluginPass, Visitor } from "@babel/core";
import template from "@babel/template";

import findCacheDir from "find-cache-dir";
import chokidar from "chokidar";
import micromatch from "micromatch";

import { addNamed, addSideEffect } from "@babel/helper-module-imports";

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
  JSXOpeningElement,
  memberExpression,
} from "@babel/types";

import type { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import resolveConfigPath from "tailwindcss/lib/util/resolveConfigPath";
import { validateConfig } from "tailwindcss/lib/util/validateConfig";

// import { getImportBlockedComponents } from "./get-import-blocked-components";
import { extractStyles } from "../postcss/extract";

export interface TailwindcssReactNativeBabelOptions {
  isInContent?: boolean;
  didTransform?: boolean;
  allowModuleTransform?: "*" | string[];
  blockModuleTransform?: string[];
  mode?: "compileAndTransform" | "compileOnly" | "transformOnly";
  rem?: number;
  tailwindConfigPath?: string;
  tailwindConfig?: Config | undefined;
}

const cacheDirectory = findCacheDir({ name: "nativewind", create: true });
if (!cacheDirectory) throw new Error("Unable to secure cache directory");

const stylesFile = join(cacheDirectory, "styles.js");
const cssCacheFile = join(cacheDirectory, "styles.css");

const watcher =
  process.env.NODE_ENV === "development"
    ? chokidar.watch(cacheDirectory)
    : undefined;

export default function (
  api: ConfigAPI,
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  /**
   * Get the users config
   */
  const userConfigPath = resolveConfigPath(
    options.tailwindConfig || options.tailwindConfigPath
  );

  let tailwindConfig: Config;

  const bundler = api.caller((caller) => {
    if (!caller) return;

    if ("bundler" in caller) {
      return caller["bundler"];
    }

    const { name } = caller;

    switch (name) {
      case "metro": {
        return "metro";
      }
      case "next-babel-turbo-loader": {
        return "webpack";
      }
      case "babel-loader": {
        return "webpack";
      }
    }
  });

  const platform = api.caller((caller) => {
    if (!caller) return;

    if ("platform" in caller) {
      return caller["platform"];
    } else if (bundler === "webpack") {
      return "web";
    }
  });

  if (platform) {
    process.env.NATIVEWIND_PLATFORM = platform;
  }

  if (userConfigPath === null) {
    tailwindConfig = resolveConfig(options.tailwindConfig);
  } else {
    delete require.cache[require.resolve(userConfigPath)];
    const newConfig = resolveConfig(require(userConfigPath));
    tailwindConfig = validateConfig(newConfig);
  }

  const hasPreset = tailwindConfig.presets?.some((preset) => {
    return (
      preset &&
      ("nativewind" in preset ||
        ("default" in preset && "nativewind" in preset["default"]))
    );
  });

  if (!hasPreset) {
    throw new Error("NativeWind preset was not included");
  }

  const safelist =
    tailwindConfig.safelist && tailwindConfig.safelist.length > 0
      ? tailwindConfig.safelist
      : ["babel-empty"];

  /**
   * Resolve their content paths
   */
  const contentFilePaths = (
    Array.isArray(tailwindConfig.content)
      ? tailwindConfig.content.filter(
          (filePath): filePath is string => typeof filePath === "string"
        )
      : tailwindConfig.content.files.filter(
          (filePath): filePath is string => typeof filePath === "string"
        )
  ).map((contentFilePath) => normalizePath(resolve(cwd, contentFilePath)));

  // const allowModuleTransform = Array.isArray(options.allowModuleTransform)
  //   ? ["react-native", "react-native-web", ...options.allowModuleTransform]
  //   : "*";

  let canCompile = true;
  let canTransform = true;

  if (options.mode === "compileOnly") {
    canTransform = false;
  } else if (options.mode === "transformOnly") {
    canCompile = false;
  }

  let cssCache: string | undefined;
  watcher?.on("change", (path) => {
    if (path.endsWith(".css")) {
      cssCache = readFileSync(path, "utf8");
    }
  });

  const isDevelopment = api.env("development");

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

        if (canCompile && state.isInContent) {
          path.traverse({
            ImportDeclaration(path) {
              const currentDirectory = dirname(filename);

              const source = resolve(currentDirectory, path.node.source.value);

              if (source.endsWith(".css")) {
                const css = readFileSync(source, "utf8");

                if (css.includes("@tailwind")) {
                  // Start watching this file as well
                  // watcher.add(filename);
                  // Write the css to disk, this will cause chokidar watchers to fire on all processes
                  writeFileSync(cssCacheFile, css);
                  // Write the new styles to disk
                  writeFileSync(
                    stylesFile,
                    `import { NativeWindStyleSheet } from "nativewind";\nNativeWindStyleSheet.create(${JSON.stringify(
                      extractStyles(tailwindConfig, css)
                    )});`
                  );
                  // Replace the .css import with the stylesFile
                  addSideEffect(
                    path,
                    `./${relative(currentDirectory, stylesFile)}`
                  );
                  path.remove();
                  // After this has been completed, Babel will reevaluate the stylesFile, reloading the styles
                }
              }
            },
          });
        }
      },
      exit(path, state) {
        if (state.didTransform) {
          addNamed(path, "StyledComponent", "nativewind");
        }

        if (
          isDevelopment &&
          canCompile &&
          state.filename &&
          state.isInContent
        ) {
          const styles = extractStyles(
            {
              ...tailwindConfig,
              content: [state.filename],
              safelist,
            },
            cssCache
          );
          path.pushContainer(
            "body",
            template.ast(
              `_NativeWindStyleSheet.create(${JSON.stringify(styles)});`
            )
          );
          addNamed(path, "NativeWindStyleSheet", "nativewind");
        }
      },
    },
    JSXElement(path, state) {
      if (!state.isInContent || !state.filename) return;

      const blockList = state.blockList as Set<string>;

      if (
        !blockList ||
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

function normalizePath(filePath: string) {
  /**
   * This is my naive way to get path matching working on Windows.
   * Basically I turn it into a posix path which seems to work fine
   *
   * If you are a windows user and understand micromatch, can you please send a PR
   * to do this the proper way
   */
  return filePath.split(sep).join(posix.sep);
}

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
