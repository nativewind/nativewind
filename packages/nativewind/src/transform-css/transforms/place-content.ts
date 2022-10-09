import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function placeContent(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
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

  if (alignContent) pushStyle(atom, "alignContent", alignContent);
  if (justifyContent) pushStyle(atom, "justifyContent", justifyContent);
}
