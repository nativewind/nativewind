import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function border(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
  }

  const children = node.value.children.toArray();

  if (children.length === 1) {
    pushStyle(atom, "borderStyle", children[0]);
  }

  if (children.length === 2) {
    if (children[0].type === "Dimension") {
      /* width | style */
      pushStyle(atom, "borderWidth", children[0]);
    } else {
      /* style | color */
      pushStyle(atom, "borderStyle", children[0]);
      pushStyle(atom, "borderColor", children[1]);
    }
  }

  if (children.length === 3) {
    pushStyle(atom, "borderWidth", children[0]);
    pushStyle(atom, "borderStyle", children[1]);
    pushStyle(atom, "borderColor", children[2]);
  }
}
