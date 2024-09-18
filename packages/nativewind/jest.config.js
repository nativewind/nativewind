/** @type {import('jest').Config} */
module.exports = {
  preset: "jest-expo",
  roots: ["src"],
  setupFiles: ["react-native-css-interop/test/setup"],
  setupFilesAfterEnv: ["react-native-css-interop/test/setupAfterEnv"],
  modulePathIgnorePatterns: ["<rootDir>/src/test"],
  moduleNameMapper: {
    "^react-native-css-interop$": "<rootDir>/../react-native-css-interop/src",
    "^react-native-css-interop/jsx-runtime$":
      "<rootDir>/../react-native-css-interop/src/runtime/jsx-runtime",
    "^react-native-css-interop/test$":
      "<rootDir>/../react-native-css-interop/src/test",
  },
};
