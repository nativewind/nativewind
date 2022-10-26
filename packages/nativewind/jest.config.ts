import type { Config } from "jest";
import { defaults as tsjPreset } from "ts-jest/presets";

const config: Config = {
  projects: [
    {
      ...tsjPreset,
      displayName: "native",
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
    } as NonNullable<Config["projects"]>[0], // Cast because we get a type error on preset?
    {
      displayName: "lint",
      runner: "jest-runner-eslint",
      testMatch: ["<rootDir>/**/*.tsx", "<rootDir>/**/*.ts"],
      testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/__tests__/archive/",
      ],
    },
  ],
};

export default config;
