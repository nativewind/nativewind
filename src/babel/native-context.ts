import { NodePath, Visitor } from "@babel/core";
import { Program } from "@babel/types";
import { Babel, State, TailwindReactNativeOptions } from "./types";
import { nativeVisitor, NativeVisitorState } from "./native-visitor";

import { getTailwindConfig } from "./tailwind/get-tailwind-config";
import { extractStyles } from "./native-style-extraction";
import { appendVariables } from "./transforms/append-variables";
import { getJSXElementName } from "./utils/jsx";
import { appendImport } from "./transforms/append-import";
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
  const { styles, media } = extractStyles(tailwindConfig);
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
            rem: 16,
            tailwindConfigPath: "tailwind.config.js",
            platform: "native-context",
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
            classNameToStyleOptions: { inlineStyles: false },
            visitor: nativeContextVisitor,
          };

          // Traverse the file
          path.traverse(nativeVisitor, nativeVisitorState);

          const {
            hasClassNames,
            hasStyleSheetImport,
            hasUseTailwindImport,
            hasProvider,
          } = nativeVisitorState;

          const bodyNode = path.node.body;

          // Add the __useParseTailwind import if it is missing
          if (hasClassNames && !hasUseTailwindImport) {
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
        ),
        t.jSXAttribute(
          t.jSXIdentifier("media"),
          t.jSXExpressionContainer(t.identifier("__tailwindMedia"))
        )
      );
    }
  },
};
