import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function flex(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
  }

  const children = node.value.children.toArray();

  if (children.length === 1) {
    const firstChild = children[0];

    if (firstChild.type === "Identifier") {
      /* Keyword values */
      if (firstChild.name === "none") {
        pushStyle(atom, "flexGrow", 0);
        pushStyle(atom, "flexShrink", 0);
        pushStyle(atom, "flexBasis", "auto");
      } else if (firstChild.name === "auto" || firstChild.name === "initial") {
        pushStyle(atom, "flexGrow", 1);
        pushStyle(atom, "flexShrink", 1);
        pushStyle(atom, "flexBasis", "auto");
      } else {
        return;
      }
    } else if (firstChild.type === "Number") {
      /* One value, unit-less number: flex-grow */
      pushStyle(atom, "flexGrow", children[0]);
    } else {
      pushStyle(atom, "flexBasis", children[0]);
    }
  }

  if (children.length === 2) {
    const secondChild = children[1];

    if (secondChild.type === "Number") {
      /* flex-grow | flex-shrink */
      pushStyle(atom, "flexGrow", children[0]);
      pushStyle(atom, "flexShrink", children[1]);
    } else {
      /* flex-grow | flex-basis */
      pushStyle(atom, "flexGrow", children[0]);
      pushStyle(atom, "flexBasis", children[1]);
    }
  }

  /* flex-grow | flex-shrink | flex-basis */
  if (children.length === 3) {
    pushStyle(atom, "flexGrow", children[0]);
    pushStyle(atom, "flexShrink", children[1]);
    pushStyle(atom, "flexBasis", children[2]);
  }
}
