import { NodePath } from "@babel/core";
import { Program } from "@babel/types";
import { getTailwindConfig } from "./tailwind/get-tailwind-config";
import { Babel, State, TailwindReactNativeOptions } from "./types";
import { webVisitor, WebVisitorState } from "./web-visitor";
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

          const webVisitorState: WebVisitorState = {
            rem: 16,
            tailwindConfigPath: "tailwind.config.js",
            platform: "web",
            blockModules: [],
            ...state,
            ...state.opts,
            allowModules,
            allowRelativeModules,
            babel,
            blockList: new Set(),
          };

          // Traverse the file
          path.traverse(webVisitor, webVisitorState);
        },
      },
    },
  };
}
