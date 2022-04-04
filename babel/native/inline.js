const { relative } = require("path");
const transformClassNames = require("./utils/transform-class-names");
const processStyles = require("./utils/process-styles");
const getTailwindConfig = require("./utils/get-tailwind-config");
const appendVariables = require("./utils/babel-variables");
const { appendImport, hasImport } = require("./utils/babel-imports");

/**
 * While in development mode, this plugin applies this transformation
 *
 * In:  `<Component className="text-dark" styles={styles.myStyles}>`
 * Out:
 *
 * ```
 * import { __useParseTailwind } from 'tailwind-react-native'
 * import { StyleSheet } from 'react-native'
 * <Component styles={[__useParseTailwind("text-dark", { styles: __tailwindStyles, media: __tailwindMedia), styles.myStyles]}>
 * const __tailwindStyles = StyleSheet.create(<Compiled styles>)
 * const __tailwindMedia = <Compiled media rules>
 * ```
 */
const convertClassNameIntoTailwindStyles = (
  babelConfig,
  { tailwindConfigPath },
  cwd
) => {
  const { types: t } = babelConfig;

  const tailwindConfig = getTailwindConfig(cwd, tailwindConfigPath);

  let classNames = false;
  let hasStyleSheetImport = false;
  let hasUseParseTailwind = false;

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
          inlineStyles: true,
        });
      },
      Program: {
        enter() {
          classNames = false;
          hasStyleSheetImport = false;
          hasUseParseTailwind = false;
        },
        exit(path, state) {
          const {
            node: { body },
          } = path;

          if (!classNames) {
            return;
          }

          if (!hasStyleSheetImport) {
            appendImport(t, body, "StyleSheet", "react-native");
          }

          if (!hasUseParseTailwind) {
            appendImport(
              t,
              body,
              "__useParseTailwind",
              "tailwindcss-react-native"
            );
          }

          const { filename, root } = state.file.opts;

          /**
           * Override tailwind to only process the classnames in this file
           */
          const { styles, media } = processStyles(babelConfig, {
            ...tailwindConfig,
            // Make sure its relative to the tailwind.config.js
            content: [relative(root, filename)],
          });

          appendVariables(body, styles, media);
        },
      },
    },
  };
};

module.exports = convertClassNameIntoTailwindStyles;
