import { Program } from "@babel/types";
import { NodePath } from "@babel/traverse";

import { extractStyles } from "./native-style-extraction";
import { getTailwindConfig } from "./tailwind/get-tailwind-config";
import { appendVariables } from "./transforms/append-variables";
import { appendImport } from "./transforms/append-import";
import { NativeVisitorState, nativeVisitor } from "./native-visitor";
import { TailwindReactNativeOptions, State, Babel } from "./types";
import {
  getAllowedPaths,
  isAllowedProgramPath,
} from "./tailwind/allowed-paths";

export default function (
  babel: Babel,
  options: TailwindReactNativeOptions,
  cwd: string
) {
  const tailwindConfig = getTailwindConfig(cwd, options);
  const { allowModules, allowRelativeModules } = getAllowedPaths(
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

          // Dirty check the file for the className attribute
          if (!state.file.code.includes("className=")) {
            return;
          }

          const nativeVisitorState: NativeVisitorState = {
            rem: 16,
            tailwindConfigPath: "tailwind.config.js",
            platform: "native-inline",
            blockModules: [],
            ...state,
            ...state.opts,
            allowModules,
            allowRelativeModules,
            babel,
            blockList: new Set(),
            hasClassNames: false,
            hasProvider: false,
            hasStyleSheetImport: false,
            hasUseTailwindImport: false,
            tailwindConfig,
            classNameToStyleOptions: { inlineStyles: true },
          };

          // Traverse the file
          path.traverse(nativeVisitor, nativeVisitorState);

          const {
            filename,
            hasClassNames,
            hasStyleSheetImport,
            hasUseTailwindImport,
          } = nativeVisitorState;

          // There are no classNames so skip this file
          if (!hasClassNames) {
            return;
          }

          const bodyNode = path.node.body;

          if (!hasUseTailwindImport) {
            appendImport(
              babel,
              bodyNode,
              "useTailwind",
              "tailwindcss-react-native"
            );
          }

          if (!hasStyleSheetImport) {
            appendImport(babel, bodyNode, "StyleSheet", "react-native");
          }

          /**
           * Override tailwind to only process the classnames in this file
           */
          const { styles, media } = extractStyles({
            ...tailwindConfig,
            content: [filename],
          });

          appendVariables(babel, bodyNode, styles, media);
        },
      },
    },
  };
}
