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
  return path.node.openingElement.attributes.some((attribute) => {
    /**
     * I think we should be able to process spread attributes
     * by checking their binding, but I still learning how this works
     *
     * If your reading this and understand Babel bindings please send a PR
     */
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
