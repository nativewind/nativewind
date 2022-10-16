import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function font(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  const children = node.value.children.toArray();

  let fontStyle;
  let fontVariant: string[] | undefined;
  let fontWeight: string | number | undefined;
  let fontStretch: string | undefined;
  let fontSize: number | undefined;
  let lineHeight: string | undefined;
  let fontFamily: string | undefined;

  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    if (!fontStyle) {
      if (child.type === "Identifier") {
        fontStyle = child.name;
        continue;
      } else {
        fontStyle = "normal";
      }
    }

    if (!fontVariant) {
      if (child.type === "Identifier" && child.name === "small-caps") {
        fontVariant = ["small-caps"];
        continue;
      } else {
        fontVariant = [];
      }
    }

    if (!fontWeight) {
      if (child.type === "Number") {
        // React Native doesn't support Number font values just yet
        fontWeight = child.value.toString();
        continue;
      } else if (child.type === "Identifier" && child.name === "bold") {
        fontWeight = child.name;
        continue;
      }
    }

    if (!fontStretch && child.type === "Identifier") {
      fontStretch = "normal";
      continue;
    }

    if (!fontSize && child.type === "Number") {
      fontSize = Number.parseInt(child.value);
      continue;
    }

    if (!lineHeight) {
      if (child.type === "Operator" && child.value === "/") {
        i++;
        child = children[i];
        if (child.type === "Number") {
          lineHeight = child.value;
        }
      }
      continue;
    }

    if (!fontFamily) {
      if (child.type === "Identifier") {
        fontFamily = child.name;
        continue;
      } else {
        fontFamily = "normal";
      }
    }
  }

  if (fontStyle !== "normal") pushStyle(styles, "fontStyle", meta, fontStyle);
  if (fontVariant && fontVariant?.length > 0) {
    pushStyle(styles, "fontVariant", meta, fontVariant);
  }
  if (fontWeight) pushStyle(styles, "fontWeight", meta, fontWeight);
  if (fontSize) pushStyle(styles, "fontSize", meta, fontSize);
  if (lineHeight) pushStyle(styles, "lineHeight", meta, lineHeight);
  if (fontFamily) pushStyle(styles, "fontFamily", meta, fontFamily);

  return styles;
}
