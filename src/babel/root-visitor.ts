import { resolve } from "node:path";
import { Program } from "@babel/types";
import { NodePath } from "@babel/traverse";

import { extractStyles } from "../postcss/extract-styles";
import { appendVariables } from "./transforms/append-variables";
import { prependImport, prependImports } from "./transforms/append-import";
import { TailwindcssReactNativeBabelOptions, State } from "./types";
import { visitor, VisitorState } from "./visitor";
import { getAllowedOptions, isAllowedProgramPath } from "./utils/allowed-paths";
import { getTailwindConfig } from "./utils/get-tailwind-config";
import { StyleError } from "../types/common";
import { babelStyleSerializer } from "../utils/serialize-styles";

export default function rootVisitor(
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  const errors: StyleError[] = [];

  const tailwindConfigPath = resolve(
    cwd,
    options.tailwindConfigPath || "./tailwind.config.js"
  );

  const tailwindConfig = getTailwindConfig(tailwindConfigPath, {
    ...options,
    onError(error) {
      errors.push(error);
    },
  });

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
            hmr: true,
            mode: "compileAndTransform",
            didTransform: false,
            blockModuleTransform: [],
            hasStyledComponentImport: false,
            canCompile,
            canTransform,
            ...state,
            ...state.opts,
            allowModuleTransform,
            allowRelativeModules,
            blockList: new Set(),
            hasProvider: false,
            hasStyleSheetImport: false,
            tailwindConfig,
            tailwindConfigPath,
          };

          // Traverse the file
          path.traverse(visitor, visitorState);

          const {
            filename,
            hasStyleSheetImport,
            didTransform,
            hasProvider,
            hasStyledComponentImport,
            hmr,
          } = visitorState;

          /*
           * If we are not hmr, we only care if this file has a provider
           */
          if (!hmr && !hasProvider) {
            return;
          }

          const extractStylesOptions = hmr
            ? {
                ...tailwindConfig,
                content: [filename],
                // If the file doesn't have any Tailwind styles, it will print a warning
                // We force an empty style to prevent this
                safelist: ["babel-empty"],
                serializer: babelStyleSerializer,
              }
            : {
                ...tailwindConfig,
                serializer: babelStyleSerializer,
              };

          const { output } = extractStyles(extractStylesOptions);

          const bodyNode = path.node.body;

          if (didTransform && !hasStyledComponentImport) {
            prependImport(
              bodyNode,
              "StyledComponent",
              "tailwindcss-react-native"
            );
          }

          // If there are no styles, early exit
          if (Object.keys(output.styles).length === 0) return;

          appendVariables(bodyNode, output);

          const imports = [];

          if (!hasStyleSheetImport) {
            imports.push(["RNStyleSheet", "StyleSheet"]);
          }

          if (output.hasPlatform) {
            imports.push(["RNPlatform", "Platform"]);
          }

          if (output.hasPlatformColor) {
            imports.push(["RNPlatformColor", "PlatformColor"]);
          }

          if (imports.length > 0) {
            prependImports(bodyNode, imports, "react-native");
          }
        },
      },
    },
  };
}
