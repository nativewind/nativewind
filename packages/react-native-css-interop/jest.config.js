module.exports = {
  preset: "jest-expo/ios",
  roots: ["src"],
  setupFiles: ["<rootDir>/src/utils/test/setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/utils/test/setupAfterEnv.ts"],
  moduleDirectories: ["node_modules", "utils", __dirname],
  moduleNameMapper: {
    "^test$": "<rootDir>/src/utils/test",
    "^test/(.*)$": "<rootDir>/src/utils/test/$1",
  },
};
