import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function flex(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();

  if (children.length === 1) {
    const firstChild = children[0];

    if (firstChild.type === "Identifier") {
      /* Keyword values */
      if (firstChild.name === "none") {
        pushStyle(styles, "flexGrow", meta, 0);
        pushStyle(styles, "flexShrink", meta, 0);
        pushStyle(styles, "flexBasis", meta, "auto");
      } else if (firstChild.name === "auto" || firstChild.name === "initial") {
        pushStyle(styles, "flexGrow", meta, 1);
        pushStyle(styles, "flexShrink", meta, 1);
        pushStyle(styles, "flexBasis", meta, "auto");
      } else {
        return styles;
      }
    } else if (firstChild.type === "Number") {
      /* One value, unit-less number: flex-grow */
      pushStyle(styles, "flexGrow", meta, children[0]);
    } else {
      pushStyle(styles, "flexBasis", meta, children[0]);
    }
  }

  if (children.length === 2) {
    const secondChild = children[1];

    if (secondChild.type === "Number") {
      /* flex-grow | flex-shrink */
      pushStyle(styles, "flexGrow", meta, children[0]);
      pushStyle(styles, "flexShrink", meta, children[1]);
    } else {
      /* flex-grow | flex-basis */
      pushStyle(styles, "flexGrow", meta, children[0]);
      pushStyle(styles, "flexBasis", meta, children[1]);
    }
  }

  /* flex-grow | flex-shrink | flex-basis */
  if (children.length === 3) {
    pushStyle(styles, "flexGrow", meta, children[0]);
    pushStyle(styles, "flexShrink", meta, children[1]);
    pushStyle(styles, "flexBasis", meta, children[2]);
  }

  return styles;
}
