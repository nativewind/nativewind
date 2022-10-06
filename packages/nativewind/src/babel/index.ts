import { readFileSync, writeFileSync, statSync } from "node:fs";
import { resolve, sep, posix, join, dirname } from "node:path";

import findCacheDir from "find-cache-dir";
import chokidar from "chokidar";
import micromatch from "micromatch";

import { addNamed, addSideEffect } from "@babel/helper-module-imports";
import type { ConfigAPI, NodePath, PluginPass, Visitor } from "@babel/core";

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

import type { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";
import resolveConfigPath from "tailwindcss/lib/util/resolveConfigPath";
import { validateConfig } from "tailwindcss/lib/util/validateConfig";

// import { getImportBlockedComponents } from "./get-import-blocked-components";
import { extractStyles } from "../postcss/extract";
import { AtomRecord } from "../postcss/types";
import { createHash } from "node:crypto";

/**
 * The Babel plugin has 3 functions
 *  - component transformation
 *  - style compilation
 *  - handling .css imports
 */
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

const cacheDirectory = findCacheDir({ name: "nativewind", create: true }) ?? "";
if (!cacheDirectory) throw new Error("Unable to secure cache directory");

const stylesFile = join(cacheDirectory, "styles.js");
const cssCacheFile = join(cacheDirectory, "styles.css");
const nativewindStylesFile = require.resolve("nativewind/dist/styles");

const watcher =
  process.env.NODE_ENV === "development"
    ? chokidar.watch(cacheDirectory)
    : undefined;

export default function (...args: unknown[]) {
  console.log(...args);
  return {
    plugins: [plugin],
  };
}

function plugin(
  api: ConfigAPI,
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  const tailwindConfig = resolveTailwindConfig(api, options);
  const platform = resolvePlatform(api);
  const isDevelopment = api.env("development");

  let canCompile = true;
  let canTransform = true;

  if (options.mode === "compileOnly") {
    canTransform = false;
  } else if (options.mode === "transformOnly") {
    canCompile = false;
  } else if (platform === "web") {
    canCompile = false;
  }

  const safelist =
    tailwindConfig.safelist && tailwindConfig.safelist.length > 0
      ? tailwindConfig.safelist
      : ["babel-empty"];

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

  // const allowModuleTransform = Array.isArray(options.allowModuleTransform)
  //   ? ["react-native", "react-native-web", ...options.allowModuleTransform]
  //   : "*";

  if (canCompile) {
    writeFileSync(
      nativewindStylesFile,
      `try { require("${stylesFile}") } catch {} // ${Date.now()}`
    );
  }

  let cssCache = `@tailwind components;@tailwind utilities;`;
  watcher?.on("change", (path) => {
    if (path.endsWith(".css")) {
      cssCache = readFileSync(path, "utf8");
    }
  });

  function fullCompile() {
    writeFileSync(
      stylesFile,
      `import { NativeWindStyleSheet } from "nativewind";\nNativeWindStyleSheet.create(${JSON.stringify(
        extractStyles(tailwindConfig, cssCache)
      )});`
    );
  }

  function handleCssImport(source: string) {
    const css = readFileSync(source, "utf8");

    if (css.includes("@tailwind")) {
      cssCache = css;
      writeFileSync(cssCacheFile, cssCache);
      fullCompile();
    }
  }

  function hotReloadStyles(filename: string, styles: AtomRecord) {
    const hash = createHash("sha1").update(filename).digest("hex");
    const cacheFilename = join(cacheDirectory, `${hash}.js`);
    writeFileSync(
      cacheFilename,
      `import { NativeWindStyleSheet } from "nativewind";\nNativeWindStyleSheet.create(${JSON.stringify(
        styles
      )}`
    );
    writeFileSync(stylesFile, `try { require("${cacheFilename}"); } catch {}`, {
      flag: "a",
    });
  }

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
              if (path.node.source.value.endsWith(".css")) {
                const currentDirectory = dirname(filename);
                handleCssImport(
                  resolve(currentDirectory, path.node.source.value)
                );
                addSideEffect(path, `nativewind/styles`);
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
                const currentDirectory = dirname(filename);
                handleCssImport(resolve(currentDirectory, argument.node.value));
                addSideEffect(path, `nativewind/styles`);
                path.remove();
              }
            },
          });
        }
      },
      exit(path, state) {
        if (state.didTransform) {
          addNamed(path, "StyledComponent", "nativewind");
        }

        if (state.filename === nativewindStylesFile) {
          fullCompile();
        } else if (
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
          hotReloadStyles(state.filename, styles);
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
        !canTransform ||
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

function resolveTailwindConfig(
  api: ConfigAPI,
  options: TailwindcssReactNativeBabelOptions
): Config {
  let tailwindConfig: Config;

  const userConfigPath = resolveConfigPath(
    options.tailwindConfig || options.tailwindConfigPath
  );

  if (userConfigPath === null) {
    tailwindConfig = resolveConfig(options.tailwindConfig);
  } else {
    api.cache.using(() => statSync(userConfigPath).mtimeMs);
    delete require.cache[require.resolve(userConfigPath)];
    const newConfig = resolveConfig(require(userConfigPath));
    tailwindConfig = validateConfig(newConfig);
  }

  const hasPreset = tailwindConfig.presets?.some((preset) => {
    return (
      typeof preset === "object" &&
      ("nativewind" in preset ||
        ("default" in preset && "nativewind" in preset["default"]))
    );
  });

  if (!hasPreset) {
    throw new Error("NativeWind preset was not included");
  }

  return tailwindConfig;
}

function resolvePlatform(api: ConfigAPI) {
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

  process.env.NATIVEWIND_PLATFORM = platform;

  return platform;
}
