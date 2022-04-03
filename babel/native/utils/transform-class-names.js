function transformClassNames({ types: t }, path, { inlineStyles }) {
  try {
    let classNames;
    let existingStyles;

    /**
     * Find the className attribute
     *  - Save its value
     *  - Remove it as react-native components will ignore it
     */
    for (const attribute of path.get("attributes")) {
      if (attribute.node.name?.name === "className") {
        if (t.isStringLiteral(attribute.node.value)) {
          classNames = attribute.node.value;
        } else {
          classNames = attribute.node.value.expression;
        }
        attribute.remove();
        break;
      }
    }

    /**
     * If classNames is empty or does not exist then exit
     */
    if (!classNames) {
      return false;
    }

    /**
     * Find the styles attribute
     *  - Save its value
     *  - Remove it, as we're going to reconstruct it
     */
    for (const attribute of path.get("attributes")) {
      if (attribute.node.name?.name === "style") {
        existingStyles = attribute.node.value.expression;
        attribute.remove();
        break;
      }
    }

    /**
     * If there are existing styles we need to merge them
     *
     * Classnames have lower specificity than inline styles
     * so they should always be first
     */
    const callExpressionArguments = inlineStyles
      ? [
          classNames,
          t.objectExpression([
            t.ObjectProperty(
              t.Identifier("styles"),
              t.Identifier("__tailwindStyles")
            ),
            t.ObjectProperty(
              t.Identifier("media"),
              t.Identifier("__tailwindMedia")
            ),
          ]),
        ]
      : [classNames];

    const callExpression = t.callExpression(
      t.identifier("__useParseTailwind"),
      callExpressionArguments
    );

    let newStyles;
    if (t.isMemberExpression(existingStyles)) {
      newStyles = t.JSXExpressionContainer(
        t.arrayExpression([callExpression, existingStyles])
      );
    } else if (t.isArrayExpression(existingStyles)) {
      existingStyles.elements.unshift(callExpression);
      newStyles = t.JSXExpressionContainer(existingStyles);
    } else {
      newStyles = t.JSXExpressionContainer(callExpression);
    }

    path.node.attributes.push(
      t.JSXAttribute(t.JSXIdentifier("style"), newStyles)
    );

    return true;
  } catch (error) {
    throw error;
  }
}
module.exports = transformClassNames;
