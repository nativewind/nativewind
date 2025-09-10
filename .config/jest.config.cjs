/* eslint-disable no-undef, @typescript-eslint/no-require-imports */

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const jestExpo = require("jest-expo/jest-preset");

process.env.REACT_NATIVE_CSS_TEST_DEBUG = true;

module.exports = {
  ...jestExpo,
  testPathIgnorePatterns: ["dist/", ".*/_[a-zA-Z]"],
  setupFilesAfterEnv: ["./.config/jest.setup.js"],
};
