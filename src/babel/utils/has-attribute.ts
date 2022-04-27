import { NodePath } from "@babel/core";
import {
  isJSXIdentifier,
  isJSXSpreadAttribute,
  JSXElement,
} from "@babel/types";

export function someAttributes(path: NodePath<JSXElement>, names: string[]) {
  const openingElement = path.node.openingElement;

  return openingElement.attributes.some((attribue) => {
    // Ignore spreads, we cannot process them
    if (isJSXSpreadAttribute(attribue)) {
      return false;
    }

    return names.some((name) => isJSXIdentifier(attribue.name, { name }));
  });
}
