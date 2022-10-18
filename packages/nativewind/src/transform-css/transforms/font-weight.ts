import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

// This only exists to force fontWeight into a string :(
export function fontWeight(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();
  const firstChild = children[0];

  if ("name" in firstChild) {
    pushStyle(styles, "fontWeight", meta, firstChild.name);
  } else if ("value" in firstChild) {
    pushStyle(styles, "fontWeight", meta, firstChild.value, {
      forceString: true,
    });
  }

  return styles;
}
