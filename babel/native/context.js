const getTailwindConfig = require("./utils/get-tailwind-config");
const transformClassNames = require("./utils/transform-class-names");
const processStyles = require("./utils/process-styles");
const appendVariables = require("./utils/babel-variables");
const { appendImport, hasImport } = require("./utils/babel-imports");

const convertClassNameIntoTailwindStyles = (
  babelConfig,
  { tailwindConfigPath },
  cwd
) => {
  const { types: t } = babelConfig;
  const tailwindConfig = getTailwindConfig(cwd, tailwindConfigPath);
  const { styles, media } = processStyles(babelConfig, tailwindConfig);

  return {
    visitor: {
      ImportDeclaration(path) {
        if (hasImport(path, "__useParseTailwind", "tailwindcss-react-native")) {
          hasUseParseTailwind = true;
        }

        if (hasImport(path, "StyleSheet", "react-native")) {
          hasStyleSheetImport = true;
        }
      },
      JSXOpeningElement(path) {
        classNames = transformClassNames(babelConfig, path, {
          inlineStyles: false,
        });

        if (path.node.name.name === "TailwindProvider") {
          hasProvider = true;

          path.node.attributes.push(
            t.JSXAttribute(
              t.JSXIdentifier("styles"),
              t.JSXExpressionContainer(t.identifier("__tailwindStyles"))
            )
          );

          path.node.attributes.push(
            t.JSXAttribute(
              t.JSXIdentifier("media"),
              t.JSXExpressionContainer(t.identifier("__tailwindMedia"))
            )
          );
        }
      },
      Program: {
        enter() {
          classNames = false;
          hasProvider = false;
          hasStyleSheetImport = false;
        },
        exit(path) {
          const {
            node: { body },
          } = path;

          if (classNames) {
            appendImport(
              t,
              body,
              "__useParseTailwind",
              "tailwindcss-react-native"
            );
          }

          if (!hasProvider) {
            return;
          }

          if (!hasStyleSheetImport) {
            appendImport(t, body, "StyleSheet", "react-native");
          }

          appendVariables(body, styles, media);
        },
      },
    },
  };
};

module.exports = convertClassNameIntoTailwindStyles;
