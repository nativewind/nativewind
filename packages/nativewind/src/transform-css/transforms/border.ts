import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function border(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();

  if (children.length === 1) {
    pushStyle(styles, "borderStyle", meta, children[0]);
  }

  if (children.length === 2) {
    if (children[0].type === "Dimension") {
      /* width | style */
      pushStyle(styles, "borderWidth", meta, children[0]);
    } else {
      /* style | color */
      pushStyle(styles, "borderStyle", meta, children[0]);
      pushStyle(styles, "borderColor", meta, children[1]);
    }
  }

  if (children.length === 3) {
    pushStyle(styles, "borderWidth", meta, children[0]);
    pushStyle(styles, "borderStyle", meta, children[1]);
    pushStyle(styles, "borderColor", meta, children[2]);
  }

  return styles;
}
