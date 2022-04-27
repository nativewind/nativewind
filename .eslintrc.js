module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:unicorn/recommended",
    "prettier",
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
    "unicorn/prevent-abbreviations": [
      "error",
      {
        allowList: {
          props: true,
          Props: true,
          ref: true,
          Ref: true,
          args: true,
        },
      },
    ],
  },
  overrides: [
    {
      files: ["./src/babel/native-style-extraction/patches/*"],
      rules: {
        "unicorn/no-null": "off",
      },
    },
    {
      files: ["*rc.js", "*.config.js", "babel.js", "./__tests__/*.spec.ts"],
      rules: {
        "unicorn/prefer-module": "off",
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
};
