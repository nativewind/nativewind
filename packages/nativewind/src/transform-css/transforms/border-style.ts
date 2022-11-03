import { Declaration, CssNode } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function borderStyle(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();
  const firstChild = children[0];

  pushBorderStyle(styles, meta, firstChild);

  return styles;
}

export function pushBorderStyle(
  styles: AtomStyle[],
  meta: SelectorMeta,
  node: CssNode
) {
  if (node.type === "Identifier" && node.name === "none") {
    pushStyle(styles, "borderWidth", meta, {
      ...node,
      type: "Number",
      value: "0",
    });
  } else {
    pushStyle(styles, "borderStyle", meta, node);
  }
}
