const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  preset: "react-native",
  transform: {
    "^.+\\.jsx$": "babel-jest",
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.spec.json",
      },
    ],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/babel/",
    "/__tests__/tailwindcss/runner/",
    "/__tests__/style-sheet/tests",
    "/__tests__/types.d.ts",
  ],
};
