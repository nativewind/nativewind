import { NodePath } from "@babel/core";
import {
  Expression,
  isJSXIdentifier,
  isJSXNamespacedName,
  JSXAttribute,
  JSXEmptyExpression,
  JSXExpressionContainer,
  JSXIdentifier,
  JSXMemberExpression,
  JSXNamespacedName,
  JSXOpeningElement,
  JSXSpreadAttribute,
  StringLiteral,
} from "@babel/types";
import { Babel } from "../types";

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
export function getJSXElementName(node: JSXOpeningElement) {
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

/**
 * Get the expression and attribute of the 'className' & 'style'
 *
 * @privateRemarks
 *
 * This was abstracted into a function due to the number of code branches
 *
 */
export function getStyleAttributesAndValues(
  { types: t }: Babel,
  nodePath: NodePath<JSXOpeningElement>
) {
  let style: JSXEmptyExpression | Expression | undefined;
  let styleAttribute: NodePath<JSXAttribute | JSXSpreadAttribute> | undefined;
  let className: StringLiteral | Expression | undefined;
  let classNameAttribute:
    | NodePath<JSXAttribute | JSXSpreadAttribute>
    | undefined;

  /**
   * Loop over all the attributes
   *
   * While silly, this is valid JSX
   *
   * <View style={myStyles} style={actualStyles} />
   *
   * So we need to loop over all attributes and just take the last ones
   *
   * We could reverse the array and break early, but most elements have <10 attributes
   */
  for (const attribute of nodePath.get("attributes")) {
    // Ignore spreads, we cannot process them
    if (t.isJSXSpreadAttribute(attribute.node)) {
      continue;
    }

    const { name, value } = attribute.node;

    if (t.isJSXIdentifier(name) && name.name === "className") {
      classNameAttribute = attribute;

      if (t.isStringLiteral(value)) {
        // className="font-bold"
        className = value;
      } else if (t.isJSXExpressionContainer(value)) {
        // className={myClassNames}

        if (t.isJSXEmptyExpression(value.expression)) {
          // Do nothing if the expression is empty
        } else {
          className = value.expression;
        }
      } else {
        throw nodePath.buildCodeFrameError(
          "Unable to parse className attribute"
        );
      }
    } else if (t.isJSXIdentifier(name) && name.name === "style") {
      styleAttribute = attribute;

      /*
       * Get the style.
       **/
      if (t.isJSXExpressionContainer(value)) {
        // style={styles.myStyles}
        style = value.expression;
      }
    }
  }

  return {
    className,
    classNameAttribute,
    style,
    styleAttribute,
  };
}

/**
 * Creates a JSXExpressionContainer for a style attribute containing __useParseTailwind().
 * It will merge with existing styles if provided.
 *
 * @privateRemarks
 *
 * This was moved into a helper function to increase readbility
 */
export function createMergedStylesExpressionContainer(
  { types: t }: Babel,
  newExpression: Expression,
  existingExpression: JSXEmptyExpression | Expression | undefined
) {
  let expressionContainer: JSXExpressionContainer;

  if (t.isMemberExpression(existingExpression)) {
    expressionContainer = t.jSXExpressionContainer(
      t.arrayExpression([newExpression, existingExpression])
    );
  } else if (t.isArrayExpression(existingExpression)) {
    existingExpression.elements.unshift(newExpression);
    expressionContainer = t.jSXExpressionContainer(existingExpression);
  } else {
    expressionContainer = t.jSXExpressionContainer(newExpression);
  }

  return expressionContainer;
}
