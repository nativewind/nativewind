import type { Config } from "jest";
import { defaults as tsjPreset } from "ts-jest/presets";

const config: Config = {
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
    "/__tests__/setup/",
    "/__tests__/babel/",
    "/__tests__/archive/",
    "/__tests__/tailwindcss/runner/",
    "/__tests__/style-sheet/tests",
    "/__tests__/types.d.ts",
    "/__tests__/utilities.ts",
  ],
};

export default config;
