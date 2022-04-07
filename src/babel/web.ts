import { NodePath } from "@babel/core";
import { Program } from "@babel/types";
import { Babel, State } from "./types";
import { webVisitor, WebVisitorState } from "./web-visitor";

export default function (babel: Babel) {
  return {
    visitor: {
      Program: {
        enter(path: NodePath<Program>, state: State) {
          // Dirty check the file for the className attribute
          if (!state.file.code.includes("className=")) {
            return;
          }

          const webVisitorState: WebVisitorState = {
            ...state,
            babel,
          };

          // Traverse the file
          path.traverse(webVisitor, webVisitorState);
        },
      },
    },
  };
}
