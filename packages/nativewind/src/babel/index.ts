import { resolve } from "node:path";
import { expressionStatement, Program } from "@babel/types";
import { NodePath } from "@babel/traverse";
import { addNamed } from "@babel/helper-module-imports";

import { extractStyles } from "../postcss/extract-styles";
import { TailwindcssReactNativeBabelOptions, State } from "./types";
import { visitor, VisitorState } from "./visitor";
import { getAllowedOptions, isAllowedProgramPath } from "./utils/allowed-paths";
import { getTailwindConfig } from "./utils/get-tailwind-config";
import { StyleError } from "../types/common";
import type { Config } from "tailwindcss";

export default function (
  _: unknown,
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  const errors: StyleError[] = [];
  let tailwindConfig: Config;

  if (options.tailwindConfig) {
    tailwindConfig = options.tailwindConfig;
  } else {
    const tailwindConfigPath = resolve(
      cwd,
      options.tailwindConfigPath || "./tailwind.config.js"
    );

    tailwindConfig = getTailwindConfig(tailwindConfigPath, {
      ...options,
      onError(error) {
        errors.push(error);
      },
    });
  }

  const { allowModuleTransform, allowRelativeModules } = getAllowedOptions(
    tailwindConfig,
    options
  );

  return {
    visitor: {
      Program: {
        enter(path: NodePath<Program>, state: State) {
          if (
            !isAllowedProgramPath({
              path: state.filename,
              allowRelativeModules,
              cwd,
            })
          ) {
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
            platform: "native",
            mode: "compileAndTransform",
            didTransform: false,
            blockModuleTransform: [],
            canCompile,
            canTransform,
            ...state,
            ...state.opts,
            allowModuleTransform,
            allowRelativeModules,
            blockList: new Set(),
            tailwindConfig: tailwindConfig,
          };

          // Traverse the file
          path.traverse(visitor, visitorState);

          const { filename, didTransform } = visitorState;

          const bodyNode = path.node.body;

          if (didTransform) {
            addNamed(path, "StyledComponent", "nativewind");
          }

          const content: Config["content"] = [filename];

          if (options.rawContent) {
            content.push({ raw: options.rawContent, extension: "html" });
          }

          const output = extractStyles({
            ...tailwindConfig,
            content,
            // If the file doesn't have any Tailwind styles, it will print a warning
            // We force an empty style to prevent this
            safelist: ["babel-empty"],
          });

          if (!output.hasStyles) return;

          bodyNode.push(expressionStatement(output.stylesheetCreateExpression));

          addNamed(path, "NativeWindStyleSheet", "nativewind");
        },
      },
    },
  };
}
