import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function fontFamily(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();
  const firstChild = children[0];

  if (firstChild.type === "Identifier") {
    pushStyle(styles, "fontFamily", meta, firstChild.name);
  } else if (firstChild.type === "String") {
    pushStyle(styles, "fontFamily", meta, firstChild.value);
  }

  return styles;
}
