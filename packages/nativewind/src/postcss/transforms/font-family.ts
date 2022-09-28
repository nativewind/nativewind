import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function fontFamily(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
  }

  const children = node.value.children.toArray();
  const firstChild = children[0];

  if (firstChild.type === "Identifier") {
    pushStyle(atom, "fontFamily", firstChild.name);
  } else if (firstChild.type === "String") {
    pushStyle(atom, "fontFamily", firstChild.value);
  }
}
