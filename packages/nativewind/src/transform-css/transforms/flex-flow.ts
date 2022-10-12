import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function flexFlow(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
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
        pushStyle(styles, "flexDirection", meta, children[0]);
      } else if (
        firstChild.name === "wrap" ||
        firstChild.name === "nowrap" ||
        firstChild.name === "wrap-reverse"
      ) {
        pushStyle(styles, "flexWrap", meta, children[0]);
      }
    }
  } else if (children.length === 2) {
    pushStyle(styles, "flexDirection", meta, children[0]);
    pushStyle(styles, "flexWrap", meta, children[1]);
  }

  return styles;
}
