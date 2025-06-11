module.exports = {
  preset: "jest-expo/ios",
  roots: ["src"],
  setupFiles: ["<rootDir>/src/test/setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setupAfterEnv.ts"],
  moduleDirectories: ["node_modules", "utils", __dirname],
  moduleNameMapper: {
    "^test$": "<rootDir>/src/test",
    "^test/(.*)$": "<rootDir>/src/test/$1",
  },
};
