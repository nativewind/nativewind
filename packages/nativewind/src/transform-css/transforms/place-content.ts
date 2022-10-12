/* eslint-disable unicorn/no-lonely-if */
import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function placeContent(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();

  let alignContent: string | undefined;
  let justifyContent: string | undefined;

  for (const child of children) {
    if (alignContent === undefined) {
      if (child.type === "Identifier") {
        switch (child.name) {
          case "first":
          case "last":
          case "safe":
          case "unsafe":
            continue;
          case "baseline":
          case "space-evenly":
          case "stretch":
            alignContent = "";
            continue;
          case "start":
            alignContent = "flex-start";
            continue;
          case "end":
            alignContent = "flex-end";
            continue;
          default:
            alignContent = child.name;
        }
      }
    }

    if (justifyContent === undefined) {
      if (child.type === "Identifier") {
        switch (child.name) {
          case "safe":
          case "unsafe":
          case "normal":
          case "left":
          case "right":
          case "stretch":
          case "inherit":
          case "initial":
          case "revert":
          case "revert-layer":
          case "unset":
            continue;
          case "start":
            justifyContent = "flex-start";
            continue;
          case "end":
            justifyContent = "flex-end";
            continue;
          default:
            justifyContent = child.name;
        }
      }
    }
  }

  if (alignContent) pushStyle(styles, "alignContent", meta, alignContent);
  if (justifyContent) pushStyle(styles, "justifyContent", meta, justifyContent);

  return styles;
}
