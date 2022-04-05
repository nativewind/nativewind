const convertClassNameIntoTailwindStyles = ({ types: t }) => {
  return {
    visitor: {
      JSXOpeningElement(path) {
        try {
          let classNames;
          let existingStyles;

          const name = path.node.name.name || path.node.name.object?.name;
          const firstCharOfName = name[0];

          // Ignore elements that start in lower case
          if (
            firstCharOfName &&
            firstCharOfName === firstCharOfName.toLowerCase()
          ) {
            return;
          }

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
            return;
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
           * Convert the classNames into a compiled style object
           */
          let newStyles = t.objectExpression([
            t.ObjectProperty(t.Identifier("$$css"), t.BooleanLiteral(true)),
            t.ObjectProperty(
              t.Identifier("tailwindcssReactNative"),
              classNames
            ),
          ]);

          /**
           * If there are existing styles we need to merge them
           *
           * Classnames have lower specificity than inline styles
           * so they should always be first
           */

          if (t.isObjectExpression(existingStyles)) {
            newStyles = t.JSXExpressionContainer(
              t.arrayExpression([newStyles, existingStyles])
            );
          } else if (t.isArrayExpression(existingStyles)) {
            existingStyles.elements.unshift(newStyles);
            newStyles = t.JSXExpressionContainer(existingStyles);
          } else {
            newStyles = t.JSXExpressionContainer(newStyles);
          }

          path.node.attributes.push(
            t.JSXAttribute(t.JSXIdentifier("style"), newStyles)
          );
        } catch (error) {
          throw error;
        }
      },
    },
  };
};

module.exports = convertClassNameIntoTailwindStyles;
