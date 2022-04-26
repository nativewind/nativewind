import { NodePath } from "@babel/core";
import {
  jsxAttribute,
  JSXElement,
  jsxIdentifier,
  stringLiteral,
} from "@babel/types";

export function appendPlatformAttribute(
  path: NodePath<JSXElement>,
  platform: string
) {
  const openingElement = path.node.openingElement;

  openingElement.attributes.push(
    jsxAttribute(jsxIdentifier("platform"), stringLiteral(platform))
  );
}
