const { defaults: tsjPreset } = require("ts-jest/presets");

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  ...tsjPreset,
  preset: "react-native",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        babelConfig: true,
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/babel/",
    "/__tests__/archive/",
    "/__tests__/tailwindcss/runner/",
    "/__tests__/style-sheet/tests",
    "/__tests__/types.d.ts",
    "/__tests__/utilities.ts",
  ],
};
