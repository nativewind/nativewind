import { Declaration } from "css-tree";
import { encodeValue } from "../encode-value";
import { DeclarationAtom, Transform } from "../types";
import { pushStyle } from "./push";

export function transform(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
  }

  const children = node.value.children.toArray();

  if (children.length === 1 && children[0].type !== "Function") {
    return;
  }

  const transform: Transform[] = [];

  for (const child of children) {
    if (child.type !== "Function") return;

    switch (child.name) {
      case "rotate":
      case "rotateX":
      case "rotateY":
      case "rotateZ":
      case "skewX":
      case "skewY":
      case "perspective":
      case "scale":
      case "scaleX":
      case "scaleY":
      case "translateX":
      case "translateY":
      case "matrix": {
        const value = encodeValue(child.children.toArray()[0], []);
        transform.push({ [child.name]: value } as unknown as Transform);
      }
    }
  }

  pushStyle(atom, "transform", transform);
}
