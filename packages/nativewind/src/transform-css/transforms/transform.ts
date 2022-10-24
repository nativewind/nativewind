import { Declaration } from "css-tree";
import { encodeValue } from "../encode-value";
import { AtomStyle, SelectorMeta, Transform } from "../types";
import { pushStyle } from "./push";

export function transform(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();

  const transform: Transform[] = [];

  for (const child of children) {
    if (child.type !== "Function") return styles;

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
      case "translate":
      case "translateX":
      case "translateY":
      case "matrix": {
        const value = encodeValue(
          child.children.toArray()[0],
          meta.subscriptions
        );
        transform.push({ [child.name]: value } as unknown as Transform);
      }
    }
  }

  pushStyle(styles, "transform", meta, transform);

  return styles;
}
