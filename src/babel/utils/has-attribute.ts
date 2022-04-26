import { NodePath } from "@babel/core";
import {
  isJSXIdentifier,
  isJSXSpreadAttribute,
  JSXElement,
} from "@babel/types";

export function hasAttribute(path: NodePath<JSXElement>, name: string) {
  const openingElement = path.node.openingElement;
  return openingElement.attributes.some((attribue) => {
    // Ignore spreads, we cannot process them
    if (isJSXSpreadAttribute(attribue)) {
      return false;
    }

    return isJSXIdentifier(attribue.name, { name });
  });
}
