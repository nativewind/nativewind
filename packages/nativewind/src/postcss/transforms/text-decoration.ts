import { Declaration } from "css-tree";
import { DeclarationAtom } from "../types";
import { pushStyle } from "./push";

export function textDecoration(atom: DeclarationAtom, node: Declaration) {
  if (node.value.type !== "Value") {
    return;
  }

  let textDecorationLine: string | undefined;
  let textDecorationStyle: string | undefined;
  let textDecorationColor: string | undefined;

  const children = node.value.children.toArray();

  let collectingDecorationLines = true;

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    const nextChild = children[i + 1];

    if (collectingDecorationLines) {
      if (child.type === "Identifier") {
        switch (child.name) {
          case "none":
          case "blink":
          case "inherit":
          case "initial":
          case "revert":
          case "revert-layer":
          case "unset":
          case "overline":
            textDecorationLine = "";
            continue;
          case "double":
          case "dashed":
            textDecorationLine = child.name;
            continue;
          case "line-through": {
            textDecorationLine = child.name;
            if (
              nextChild.type === "Identifier" &&
              nextChild.name === "underline"
            ) {
              i++;
              textDecorationLine = "underline line-through";
            }
            continue;
          }
          case "underline": {
            textDecorationLine = child.name;
            if (
              nextChild.type === "Identifier" &&
              nextChild.name === "line-through"
            ) {
              i++;
              textDecorationLine = "underline line-through";
            }
            continue;
          }
          default: {
            collectingDecorationLines = false;
          }
        }
      }
    }

    if (textDecorationStyle === undefined) {
      if (child.type === "Identifier") {
        switch (child.name) {
          case "wavy":
          case "inherit":
          case "initial":
          case "revert":
          case "revert-layer":
          case "unset":
            textDecorationStyle = "";
            continue;
          case "solid":
          case "double":
          case "dotted":
          case "dashed":
            textDecorationStyle = child.name;
            continue;
        }
      }
    }

    if (textDecorationColor === undefined) {
      if (child.type === "Identifier") {
        textDecorationColor = child.name;
      }
    }
  }

  if (textDecorationStyle) {
    pushStyle(atom, "textDecorationStyle", textDecorationStyle);
  }
  if (textDecorationLine) {
    pushStyle(atom, "textDecorationLine", textDecorationLine);
  }
  if (textDecorationColor) {
    pushStyle(atom, "textDecorationColor", textDecorationColor);
  }
}
