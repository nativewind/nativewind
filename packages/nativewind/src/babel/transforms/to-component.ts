import {
  identifier,
  Identifier,
  isJSXIdentifier,
  isJSXMemberExpression,
  jSXAttribute,
  jsxExpressionContainer,
  JSXIdentifier,
  jsxIdentifier,
  jSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  memberExpression,
  MemberExpression,
} from "@babel/types";
import { NodePath, types } from "@babel/core";

export function toStyledComponent(path: NodePath<types.JSXElement>): boolean {
  const openingElement = path.node.openingElement;

  openingElement.attributes.push(
    jSXAttribute(
      jSXIdentifier("component"),
      jsxExpressionContainer(jsxVariableToJsVariable(openingElement.name))
    )
  );

  openingElement.name = jsxIdentifier("StyledComponent");
  if (path.node.closingElement) {
    path.node.closingElement.name = jsxIdentifier("StyledComponent");
  }

  return true;
}

function jsxVariableToJsVariable(
  name: JSXIdentifier | JSXMemberExpression | JSXNamespacedName
): Identifier | MemberExpression {
  if (isJSXIdentifier(name)) {
    return identifier(name.name);
  } else if (isJSXMemberExpression(name)) {
    return memberExpression(
      jsxVariableToJsVariable(name.object),
      jsxVariableToJsVariable(name.property)
    );
  } else {
    // ReactJSX does not support namespaced names
    //
    // https://github.com/facebook/react/issues/11321
    // https://github.com/babel/babel/blob/e498bee10f0123bb208baa228ce6417542a2c3c4/packages/babel-helper-builder-react-jsx/src/index.js#L15-L22
    throw new Error(
      "Namespace tags are not supported by default. React's JSX doesn't support namespace tags."
    );
  }
}
