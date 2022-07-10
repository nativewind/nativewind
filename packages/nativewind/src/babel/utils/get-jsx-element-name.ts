import { types } from "@babel/core";
import {
  isJSXIdentifier,
  isJSXNamespacedName,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
} from "@babel/types";

/**
 * Get the name of a JXS Element
 *
 * @remarks
 *
 * Valid JSX:
 *
 * <MyComponent />
 * <A.MyComponent />
 * <B.A.MyComponent />
 * <C.B.A.MyComponent />
 * ..etc
 *
 * @privateRemarks
 *
 * This was abstracted as it needs to be recursive
 *
 */
export function getJSXElementName(node: types.JSXOpeningElement) {
  return getElementName(node.name);
}

/**
 * Recursive helper function for getJSXElementName
 */
function getElementName(
  node: JSXIdentifier | JSXNamespacedName | JSXMemberExpression
): string {
  if (isJSXIdentifier(node)) {
    return node.name;
  } else if (isJSXNamespacedName(node)) {
    return node.name.name;
  } else {
    return getElementName(node.object);
  }
}
