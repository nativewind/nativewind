/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/native-inline/",
    "/__tests__/native-context/",
    "/__tests__/web/",
    "/__tests__/tailwindcss/runner.ts",
    "/__tests__/types.d.ts",
  ],
  globals: {
    "ts-jest": {
      tsconfig: "tsconfig.test.json",
    },
  },
};
