module.exports = {
  preset: "react-native",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/native-context-fixtures/",
    "/__tests__/native-inline-fixtures/",
    "/__tests__/web-fixtures/",
  ],
};
