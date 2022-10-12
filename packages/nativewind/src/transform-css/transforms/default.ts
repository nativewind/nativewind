import { Declaration, parse } from "css-tree";
import { encodeValue } from "../encode-value";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function defaultDeclaration(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type === "Raw") {
    // Raw nodes are either CSS variables or invalid CSS
    if (node.property.startsWith("--")) {
      const ast = parse(node.value.value, { context: "value" });

      if (ast.type !== "Value") {
        return styles;
      }

      const value = encodeValue(ast.children.toArray()[0], meta.topics);
      if (typeof value === "object" && !("function" in value)) {
        return styles;
      }

      if (value !== undefined) {
        meta.variables.push({ [node.property]: value });
      }
    }
  } else {
    pushStyle(styles, node.property, meta, node.value.children.toArray()[0]);
  }

  return styles;
}
