// spell-checker: words tseslint
import cspellESLintPluginRecommended from "@cspell/eslint-plugin/recommended";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["**/dist", "**/.cache", "examples/**", "apps/**", "**/*.js"],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  pluginReact.configs.flat["jsx-runtime"],
  cspellESLintPluginRecommended,
  {
    rules: {
      "prefer-const": [
        "error",
        {
          destructuring: "all",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
];
