import { Program } from "@babel/types";
import { NodePath } from "@babel/traverse";

import { extractStyles } from "./native-style-extraction";
import { appendVariables } from "./transforms/append-variables";
import { prependImport } from "./transforms/append-import";
import { TailwindcssReactNativeBabelOptions, State } from "./types";
import { visitor, VisitorState } from "./visitor";
import { getAllowedOptions, isAllowedProgramPath } from "./utils/allowed-paths";
import { getTailwindConfig } from "./utils/get-tailwind-config";

export default function rootVisitor(
  options: TailwindcssReactNativeBabelOptions,
  cwd: string
) {
  const tailwindConfig = getTailwindConfig(cwd, options);
  const { allowModules, allowRelativeModules } = getAllowedOptions(
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

          const visitorState: VisitorState = {
            rem: 16,
            tailwindConfigPath: "tailwind.config.js",
            platform: "native",
            hmr: true,
            skipTransform: false,
            blockModules: [],
            hasStyledComponentImport: false,
            hasClassNames: false,
            ...state,
            ...state.opts,
            allowModules,
            allowRelativeModules,
            blockList: new Set(),
            hasProvider: false,
            hasStyleSheetImport: false,
            tailwindConfig,
          };

          // Traverse the file
          path.traverse(visitor, visitorState);

          const {
            filename,
            hasStyleSheetImport,
            hasProvider,
            hasStyledComponentImport,
            hasClassNames,
            skipTransform,
            hmr,
          } = visitorState;

          if (hmr) {
            // There are no classNames so skip this file
            if (!hasClassNames) {
              return;
            }

            /**
             * Override tailwind to only process the classnames in this file
             */
            const { styles, media } = extractStyles({
              ...tailwindConfig,
              content: [filename],
            });

            const bodyNode = path.node.body;

            if (!hasStyledComponentImport && !skipTransform) {
              prependImport(
                bodyNode,
                "StyledComponent",
                "tailwindcss-react-native"
              );
            }

            appendVariables(bodyNode, styles, media);

            if (!hasStyleSheetImport) {
              prependImport(bodyNode, "StyleSheet", "react-native");
            }
          } else {
            if (!hasProvider) {
              return;
            }

            /**
             * Override tailwind to only process the classnames in this file
             */
            const { styles, media } = extractStyles(tailwindConfig);

            const bodyNode = path.node.body;
            appendVariables(bodyNode, styles, media);

            if (!hasStyleSheetImport) {
              prependImport(bodyNode, "StyleSheet", "react-native");
            }
          }
        },
      },
    },
  };
}
