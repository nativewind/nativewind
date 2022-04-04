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

  const hasClassNames = new Set();
  const hasUseParseTailwind = new Set();
  const hasStyleSheetImport = new Set();
  const hasProvider = new Set();

  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { filename } = state.file.opts;

        if (hasImport(path, "__useParseTailwind", "tailwindcss-react-native")) {
          hasUseParseTailwind.add(filename);
        }

        if (hasImport(path, "StyleSheet", "react-native")) {
          hasStyleSheetImport.add(filename);
        }
      },
      JSXOpeningElement(path, state) {
        const { filename } = state.file.opts;

        classNames = transformClassNames(babelConfig, path, {
          inlineStyles: false,
        });

        if (classNames) {
          hasClassNames.add(filename);
        }

        if (path.node.name.name === "TailwindProvider") {
          hasProvider.add(filename);

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
        exit(path, state) {
          const {
            node: { body },
          } = path;

          const { filename } = state.file.opts;

          // If there are classNames, but there is no import - add the import
          if (
            hasClassNames.has(filename) &&
            !hasUseParseTailwind.has(filename)
          ) {
            appendImport(
              t,
              body,
              "__useParseTailwind",
              "tailwindcss-react-native"
            );
          }

          // If there is no provider - then our work here is done
          if (!hasProvider.has(filename)) {
            return;
          }

          if (!hasStyleSheetImport.has(filename)) {
            appendImport(t, body, "StyleSheet", "react-native");
          }

          appendVariables(body, styles, media);
        },
      },
    },
  };
};

module.exports = convertClassNameIntoTailwindStyles;
