import { NodePath, Visitor } from "@babel/core";
import { Program } from "@babel/types";
import { Babel, State, TailwindReactNativeOptions } from "./types";
import { nativeVisitor, NativeVisitorState } from "./native-visitor";

import { getTailwindConfig } from "./tailwind/get-tailwind-config";
import { processStyles } from "./utils/process-styles";
import { appendVariables } from "./utils/native-variables";
import { appendImport } from "./utils/imports";
import { getJSXElementName } from "./utils/jsx";
import { getAllowedPaths } from "./tailwind/allowed-paths";

export default function (
  babel: Babel,
  options: TailwindReactNativeOptions,
  cwd: string
) {
  const tailwindConfig = getTailwindConfig(cwd, options);
  const allowedContentPaths = getAllowedPaths(tailwindConfig);
  const { styles, media } = processStyles(tailwindConfig);

  return {
    visitor: {
      Program: {
        enter(path: NodePath<Program>, state: State) {
          /* Dirty check the file for
           *  - className attribute
           *  - TailwindProvider
           */
          if (
            !state.file.code.includes("className=") &&
            !state.file.code.includes("TailwindProvider")
          ) {
            return;
          }

          const nativeVisitorState: NativeVisitorState = {
            ...state,
            babel,
            tailwindConfig,
            blockList: new Set(),
            hasUseParseTailwind: false,
            hasStyleSheetImport: false,
            hasClassNames: false,
            hasProvider: false,
            transformClassNameOptions: { inlineStyles: false },
            visitor: nativeContextVisitor,
            allowedContentPaths,
          };

          // Traverse the file
          path.traverse(nativeVisitor, nativeVisitorState);

          const {
            hasClassNames,
            hasStyleSheetImport,
            hasUseParseTailwind,
            hasProvider,
          } = nativeVisitorState;

          const bodyNode = path.node.body;

          // Add the __useParseTailwind import if it is missing
          if (hasClassNames && !hasUseParseTailwind) {
            appendImport(
              babel,
              bodyNode,
              "useTailwind",
              "tailwindcss-react-native"
            );
          }

          // If there is no TailwindProvider in this file, then we can finish early
          if (!hasProvider) {
            return;
          }

          // Add the StyleSheet import if it is missing
          if (!hasStyleSheetImport) {
            appendImport(babel, bodyNode, "StyleSheet", "react-native");
          }

          appendVariables(babel, bodyNode, styles, media);
        },
      },
    },
  };
}

const nativeContextVisitor: Visitor<NativeVisitorState> = {
  JSXOpeningElement(path, state) {
    const { types: t } = state.babel;

    const elementIsTailwindProvider =
      getJSXElementName(path.node) === "TailwindProvider";

    state.hasProvider ||= elementIsTailwindProvider;

    if (elementIsTailwindProvider) {
      path.node.attributes.push(
        t.jSXAttribute(
          t.jSXIdentifier("styles"),
          t.jSXExpressionContainer(t.identifier("__tailwindStyles"))
        )
      );

      path.node.attributes.push(
        t.jSXAttribute(
          t.jSXIdentifier("media"),
          t.jSXExpressionContainer(t.identifier("__tailwindMedia"))
        )
      );
    }
  },
};
