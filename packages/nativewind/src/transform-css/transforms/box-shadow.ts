import { Declaration } from "css-tree";
import { AtomStyle, SelectorMeta } from "../types";
import { pushStyle } from "./push";

export function boxShadow(node: Declaration, meta: SelectorMeta) {
  const styles: AtomStyle[] = [];

  if (node.value.type !== "Value") {
    return styles;
  }

  let children = node.value.children.toArray().filter((child) => {
    return child.type !== "WhiteSpace";
  });

  const operatorIndex = children.findIndex(
    (child) => child.type === "Operator"
  );

  if (operatorIndex > 0) {
    children = children.slice(operatorIndex);
  }

  /* Keyword values */
  if (children.length === 1) {
    const child = node.value.children.shift()?.data;

    switch (child?.type) {
      case "Identifier": {
        return styles;
      }
      default: {
        pushStyle(styles, "borderStyle", meta, children[0]);
      }
    }
  }

  /* offset-x | offset-y | color */
  if (children.length === 3) {
    pushStyle(styles, "shadowOffset.width", meta, children[0]);
    pushStyle(styles, "shadowOffset.height", meta, children[1]);
    pushStyle(styles, "shadowColor", meta, children[2], {
      forceFunction: "toRGB",
    });
    pushStyle(styles, "shadowOpacity", meta, children[2], {
      forceFunction: "rgbOpacity",
    });
  }

  if (children.length === 4) {
    /* inset | offset-x | offset-y | color */
    if (children[0].type === "Identifier" && children[0].name === "inset") {
      return styles;
    }

    /* offset-x | offset-y | blur-radius | color */
    pushStyle(styles, "shadowOffset.width", meta, children[0]);
    pushStyle(styles, "shadowOffset.height", meta, children[1]);
    pushStyle(styles, "shadowRadius", meta, children[2]);
    pushStyle(styles, "shadowColor", meta, children[3], {
      forceFunction: "toRGB",
    });
    pushStyle(styles, "shadowOpacity", meta, children[3], {
      forceFunction: "rgbOpacity",
    });
  }

  /* offset-x | offset-y | blur-radius | spread-radius | color */
  if (children.length === 5) {
    pushStyle(styles, "shadowOffset.width", meta, children[0]);
    pushStyle(styles, "shadowOffset.height", meta, children[1]);
    pushStyle(styles, "shadowRadius", meta, children[3]);
    pushStyle(styles, "shadowColor", meta, children[4], {
      forceFunction: "toRGB",
    });
    pushStyle(styles, "shadowOpacity", meta, children[4], {
      forceFunction: "rgbOpacity",
    });
  }

  return styles;
}
