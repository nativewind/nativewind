module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "@cspell"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "prettier",
    "plugin:@cspell/recommended",
  ],
  env: {
    node: true,
  },
  ignorePatterns: ["dist/*", "types.d.ts", "coverage/*"],
  rules: {
    "@typescript-eslint/no-unused-vars": [
      "error",
      { ignoreRestSiblings: true },
    ],
    "unicorn/prefer-ternary": ["error", "only-single-line"],
    "unicorn/numeric-separators-style": "off",
    "unicorn/prevent-abbreviations": [
      "error",
      {
        allowList: {
          fn: true,
          prop: true,
          Prop: true,
          props: true,
          Props: true,
          ref: true,
          Ref: true,
          args: true,
          params: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: [
        "*rc.js",
        "*.config.js",
        "plugin.js",
        "babel.js",
        "postcss.js",
        "plugin.js",
        "commitlint.config.js",
        "tailwind/css.js",
        "tailwind/native.js",
      ],
      rules: {
        "unicorn/prefer-module": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
    {
      files: ["examples/**/*.tsx"],
      rules: {
        "unicorn/filename-case": "off",
      },
    },
    {
      files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
      extends: ["plugin:testing-library/react"],
    },
  ],
};
