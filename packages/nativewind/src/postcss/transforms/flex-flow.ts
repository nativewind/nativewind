import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function flexFlow(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
  }

  const children = node.value.children.toArray();

  if (children.length === 1) {
    const firstChild = children[0];

    if (firstChild.type === "Identifier") {
      if (
        firstChild.name === "row" ||
        firstChild.name === "column" ||
        firstChild.name === "row-reverse" ||
        firstChild.name === "column-reverse"
      ) {
        pushStyle(atom, "flexDirection", children[0]);
      } else if (
        firstChild.name === "wrap" ||
        firstChild.name === "nowrap" ||
        firstChild.name === "wrap-reverse"
      ) {
        pushStyle(atom, "flexWrap", children[0]);
      }
    }
  } else if (children.length === 2) {
    pushStyle(atom, "flexDirection", children[0]);
    pushStyle(atom, "flexWrap", children[1]);
  }
}
