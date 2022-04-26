import { Program } from "@babel/types";
import { NodePath } from "@babel/traverse";

import { extractStyles } from "./native-style-extraction";
import { getTailwindConfig } from "./tailwind/get-tailwind-config";
import { appendVariables } from "./transforms/append-variables";
import { prependImport } from "./transforms/append-import";
import { TailwindReactNativeOptions, State } from "./types";
import { visitor, VisitorState } from "./visitor";
import { componentProxy, packageName } from "./transforms/constants";
import {
  getAllowedOptions,
  isAllowedProgramPath,
} from "./tailwind/allowed-paths";

export default function rootVisitor(
  options: TailwindReactNativeOptions,
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

            if (!hasStyledComponentImport) {
              prependImport(bodyNode, componentProxy, packageName);
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
            const { styles, media } = extractStyles({
              ...tailwindConfig,
              content: [filename],
            });

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
