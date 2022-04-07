import { relative } from "path";
import { Program } from "@babel/types";
import { NodePath } from "@babel/traverse";

import { processStyles } from "./utils/process-styles";
import { getTailwindConfig } from "./tailwind/get-tailwind-config";
import { appendVariables } from "./utils/native-variables";
import { appendImport } from "./utils/imports";
import { NativeVisitorState, nativeVisitor } from "./native-visitor";
import { TailwindReactNativeOptions, State, Babel } from "./types";

export default function (
  babel: Babel,
  options: TailwindReactNativeOptions,
  cwd: string
) {
  const tailwindConfig = getTailwindConfig(cwd, options);

  return {
    visitor: {
      Program: {
        enter(path: NodePath<Program>, state: State) {
          // Dirty check the file for the className attribute
          if (!state.file.code.includes("className=")) {
            return;
          }

          const nativeVisitorState: NativeVisitorState = {
            ...state,
            babel,
            tailwindConfig,
            blackedListedComponents: new Set(),
            hasUseParseTailwind: false,
            hasStyleSheetImport: false,
            hasClassNames: false,
            hasProvider: false,
            transformClassNameOptions: { inlineStyles: true },
          };

          // Traverse the file
          path.traverse(nativeVisitor, nativeVisitorState);

          const {
            filename,
            hasClassNames,
            hasStyleSheetImport,
            hasUseParseTailwind,
          } = nativeVisitorState;

          // There are no classNames so skip this file
          if (!hasClassNames) {
            return;
          }

          const rootDir = state.file.opts.root ?? ".";
          const bodyNode = path.node.body;

          if (!hasUseParseTailwind) {
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
          const { styles, media } = processStyles({
            ...tailwindConfig,
            // Make sure its relative to the tailwind.config.js
            content: [relative(rootDir, filename)],
          });

          appendVariables(babel, bodyNode, styles, media);
        },
      },
    },
  };
}
