import { NodePath, types } from "@babel/core";
import {
  isJSXAttribute,
  isJSXIdentifier,
  isJSXSpreadAttribute,
} from "@babel/types";

export function someAttributes(
  path: NodePath<types.JSXElement>,
  names: string[]
) {
  const openingElement = path.node.openingElement;

  return openingElement.attributes.some((attribute) => {
    // Ignore spreads, we cannot process them
    if (isJSXSpreadAttribute(attribute)) {
      return false;
    }

    return names.some((name) => {
      return (
        isJSXAttribute(attribute) && isJSXIdentifier(attribute.name, { name })
      );
    });
  });
}
