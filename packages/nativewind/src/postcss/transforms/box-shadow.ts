import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function boxShadow(atom: DeclarationAtom, node: Declaration) {
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

  /* Keyword values */
  if (children.length === 1) {
    const child = node.value.children.shift()?.data;

    switch (child?.type) {
      case "Identifier":
        return;
      default:
        pushStyle(atom, "borderStyle", children[0]);
    }
  }

  /* offset-x | offset-y | color */
  if (children.length === 3) {
    pushStyle(atom, "shadowOffset.width", children[0]);
    pushStyle(atom, "shadowOffset.height", children[1]);
    pushStyle(atom, "shadowColor", children[2]);
  }

  if (children.length === 4) {
    /* inset | offset-x | offset-y | color */
    if (children[0].type === "Identifier" && children[0].name === "inset") {
      return;
    }

    /* offset-x | offset-y | blur-radius | color */
    pushStyle(atom, "shadowOffset.width", children[0]);
    pushStyle(atom, "shadowOffset.height", children[1]);
    pushStyle(atom, "shadowRadius", children[2]);
    pushStyle(atom, "shadowColor", children[3]);
  }

  /* offset-x | offset-y | blur-radius | spread-radius | color */
  if (children.length === 5) {
    pushStyle(atom, "shadowOffset.width", children[0]);
    pushStyle(atom, "shadowOffset.height", children[1]);
    pushStyle(atom, "shadowRadius", children[3]);
    pushStyle(atom, "shadowColor", children[4]);
  }
}
