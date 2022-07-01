import { NodePath } from "@babel/core";
import {
  isJSXIdentifier,
  isJSXSpreadAttribute,
  JSXElement,
} from "@babel/types";

export function someAttributes(path: NodePath<JSXElement>, names: string[]) {
  const openingElement = path.node.openingElement;

  return openingElement.attributes.some((attribute) => {
    // Ignore spreads, we cannot process them
    if (isJSXSpreadAttribute(attribute)) {
      return false;
    }

    return names.some((name) => isJSXIdentifier(attribute.name, { name }));
  });
}
