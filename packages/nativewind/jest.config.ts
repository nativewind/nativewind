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
    "/__tests__/archive/",
    "/__tests__/test-utils.ts",
  ],
};

export default config;
