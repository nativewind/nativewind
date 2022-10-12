import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function textShadow(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
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
    // Do nothing
  }

  /* offset-x | offset-y */
  if (children.length === 2) {
    pushStyle(styles, "textShadowOffset.width", meta, children[0]);
    pushStyle(styles, "textShadowOffset.height", meta, children[1]);
  }

  if (children.length === 3) {
    if (firstChild.type === "Dimension") {
      /* offset-x | offset-y | color */
      pushStyle(styles, "textShadowOffset.width", meta, children[0]);
      pushStyle(styles, "textShadowOffset.height", meta, children[1]);
      pushStyle(styles, "textShadowColor", meta, children[2]);
    } else {
      /* color | offset-x | offset-y */
      pushStyle(styles, "textShadowColor", meta, children[0]);
      pushStyle(styles, "textShadowOffset.width", meta, children[1]);
      pushStyle(styles, "textShadowOffset.height", meta, children[2]);
    }
  }

  if (children.length === 4) {
    if (firstChild.type === "Dimension") {
      /* offset-x | offset-y | blur-radius | color */
      pushStyle(styles, "textShadowOffset.width", meta, children[0]);
      pushStyle(styles, "textShadowOffset.height", meta, children[1]);
      pushStyle(styles, "textShadowRadius", meta, children[2]);
      pushStyle(styles, "textShadowColor", meta, children[3]);
    } else {
      /* color | offset-x | offset-y | blur-radius */
      pushStyle(styles, "textShadowColor", meta, children[0]);
      pushStyle(styles, "textShadowOffset.width", meta, children[1]);
      pushStyle(styles, "textShadowOffset.height", meta, children[2]);
      pushStyle(styles, "textShadowRadius", meta, children[3]);
    }
  }

  return styles;
}
