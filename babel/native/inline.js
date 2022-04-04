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

  const hasClassNames = new Set();
  const hasUseParseTailwind = new Set();
  const hasStyleSheetImport = new Set();

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

        const classNames = transformClassNames(babelConfig, path, {
          inlineStyles: true,
        });

        if (classNames) {
          hasClassNames.add(filename);
        }
      },
      Program: {
        exit(path, state) {
          const {
            node: { body },
          } = path;

          const { filename, root } = state.file.opts;

          // There are no classNames so skip this file
          if (!hasClassNames.has(filename)) {
            return;
          }

          if (!hasStyleSheetImport.has(filename)) {
            appendImport(t, body, "StyleSheet", "react-native");
          }

          if (!hasUseParseTailwind.has(filename)) {
            appendImport(
              t,
              body,
              "__useParseTailwind",
              "tailwindcss-react-native"
            );
          }

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
