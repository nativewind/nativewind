import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function textDecorationLine(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();

  let textDecorationLine: string | undefined;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const nextChild = children[i + 1];

    if (child.type === "Identifier") {
      switch (child.name) {
        case "none":
        case "blink":
        case "inherit":
        case "initial":
        case "revert":
        case "revert-layer":
        case "unset":
        case "overline": {
          break;
        }
        case "double":
        case "dashed": {
          textDecorationLine = child.name;
          break;
        }
        case "line-through": {
          textDecorationLine = child.name;
          if (
            nextChild &&
            nextChild.type === "Identifier" &&
            nextChild.name === "underline"
          ) {
            i++;
            textDecorationLine = "underline line-through";
          }
          break;
        }
        case "underline": {
          textDecorationLine = child.name;
          if (
            nextChild &&
            nextChild.type === "Identifier" &&
            nextChild.name === "line-through"
          ) {
            i++;
            textDecorationLine = "underline line-through";
          }

          break;
        }
      }
    }
  }

  if (textDecorationLine) {
    pushStyle(styles, "textDecorationLine", meta, textDecorationLine);
  }

  return styles;
}
