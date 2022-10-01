import { Declaration, parse } from "css-tree";
import { encodeValue } from "../encode-value";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function defaultDeclaration(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type === "Raw") {
    // Raw nodes are either CSS variables or invalid CSS
    if (node.property.startsWith("--")) {
      const ast = parse(node.value.value, { context: "value" });

      if (ast.type !== "Value") {
        return;
      }

      const value = encodeValue(ast.children.toArray()[0], []);
      if (typeof value === "object" && !("function" in value)) {
        return;
      }

      if (value !== undefined) {
        atom.variables.push({ [node.property]: value });
      }
    }
  } else {
    return pushStyle(atom, node.property, node.value.children.toArray()[0]);
  }
}
