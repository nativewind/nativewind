/** @type {import('jest').Config} */

const jestExpo = require("jest-expo/jest-preset");

process.env.NATIVEWIND_TEST_AUTO_DEBUG = "true";

module.exports = {
  ...jestExpo,
  testPathIgnorePatterns: ["dist/"],
};
