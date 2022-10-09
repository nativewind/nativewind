import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function textShadow(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
  }

  let children = node.value.children.toArray();

  const operatorIndex = children.findIndex(
    (child) => child.type === "Operator"
  );

  if (operatorIndex > 0) {
    children = children.slice(operatorIndex);
  }

  const firstChild = children[0];

  /* Keyword values */
  if (children.length === 1) {
    return;
  }

  /* offset-x | offset-y */
  if (children.length === 2) {
    pushStyle(atom, "textShadowOffset.width", children[0]);
    pushStyle(atom, "textShadowOffset.height", children[1]);
    return;
  }

  if (children.length === 3) {
    if (firstChild.type === "Dimension") {
      /* offset-x | offset-y | color */
      pushStyle(atom, "textShadowOffset.width", children[0]);
      pushStyle(atom, "textShadowOffset.height", children[1]);
      pushStyle(atom, "textShadowColor", children[2]);
    } else {
      /* color | offset-x | offset-y */
      pushStyle(atom, "textShadowColor", children[0]);
      pushStyle(atom, "textShadowOffset.width", children[1]);
      pushStyle(atom, "textShadowOffset.height", children[2]);
    }
    return;
  }

  if (children.length === 4) {
    if (firstChild.type === "Dimension") {
      /* offset-x | offset-y | blur-radius | color */
      pushStyle(atom, "textShadowOffset.width", children[0]);
      pushStyle(atom, "textShadowOffset.height", children[1]);
      pushStyle(atom, "textShadowRadius", children[2]);
      pushStyle(atom, "textShadowColor", children[3]);
    } else {
      /* color | offset-x | offset-y | blur-radius */
      pushStyle(atom, "textShadowColor", children[0]);
      pushStyle(atom, "textShadowOffset.width", children[1]);
      pushStyle(atom, "textShadowOffset.height", children[2]);
      pushStyle(atom, "textShadowRadius", children[3]);
    }
    return;
  }
}
