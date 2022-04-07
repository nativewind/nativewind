/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/native-context-fixtures/",
    "/__tests__/native-inline-fixtures/",
    "/__tests__/web-fixtures/",
  ],
};
