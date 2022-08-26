import { resolve, sep, posix } from "node:path";

import micromatch from "micromatch";

import type { Config } from "tailwindcss";
import resolveConfigPath from "tailwindcss/lib/util/resolveConfigPath";
import resolveConfig from "tailwindcss/resolveConfig";
import { validateConfig } from "tailwindcss/lib/util/validateConfig";

import { expressionStatement, Program } from "@babel/types";
import { NodePath } from "@babel/traverse";
import { addNamed } from "@babel/helper-module-imports";

import { extractStyles } from "../postcss/extract-styles";
import { TailwindcssReactNativeBabelOptions, State } from "./types";
import { visitor, VisitorState } from "./visitor";

import { nativePlugin } from "../tailwind/native";

export default function (
  _: unknown,
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

  if (userConfigPath === null) {
    tailwindConfig = resolveConfig({
      ...options.tailwindConfig,
      plugins: [
        nativePlugin(options),
        ...(options?.tailwindConfig?.plugins ?? []),
      ],
    });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires,unicorn/prefer-module
    const userConfig = require(userConfigPath);
    const newConfig = resolveConfig({
      ...userConfig,
      plugins: [nativePlugin(options), ...(userConfig?.plugins ?? [])],
    });

    tailwindConfig = validateConfig(newConfig);
  }

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

  const allowModuleTransform = Array.isArray(options.allowModuleTransform)
    ? ["react-native", "react-native-web", ...options.allowModuleTransform]
    : "*";

  return {
    visitor: {
      Program: {
        enter(nodePath: NodePath<Program>, state: State) {
          const isInContent = micromatch.isMatch(
            normalizePath(state.filename),
            contentFilePaths
          );

          if (!isInContent) {
            return;
          }

          let canCompile = true;
          let canTransform = true;

          switch (state.opts.mode) {
            case "compileOnly": {
              canTransform = false;
              break;
            }
            case "transformOnly": {
              canCompile = false;
              break;
            }
          }

          const visitorState: VisitorState = {
            cwd,
            rem: 16,
            mode: "compileAndTransform",
            didTransform: false,
            blockModuleTransform: [],
            canCompile,
            canTransform,
            ...state,
            ...state.opts,
            allowModuleTransform,
            allowRelativeModules: contentFilePaths,
            blockList: new Set(),
            tailwindConfig: tailwindConfig,
          };

          // Traverse the file
          nodePath.traverse(visitor, visitorState);

          const { filename, didTransform } = visitorState;

          const bodyNode = nodePath.node.body;

          if (didTransform) {
            addNamed(nodePath, "StyledComponent", "nativewind");
          }

          const output = extractStyles({
            ...tailwindConfig,
            content: [filename],
            // If the file doesn't have any Tailwind styles, it will print a warning
            // We force an empty style to prevent this
            safelist: tailwindConfig.safelist ?? ["babel-empty"],
          });

          if (!output.hasStyles) return;

          bodyNode.push(expressionStatement(output.stylesheetCreateExpression));

          addNamed(nodePath, "NativeWindStyleSheet", "nativewind");
        },
      },
    },
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
