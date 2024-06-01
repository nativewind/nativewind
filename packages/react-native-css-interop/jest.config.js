module.exports = {
  preset: "jest-expo/ios",
  roots: ["src"],
  setupFiles: ["./src/utils/test-utils/setup.ts"],
  setupFilesAfterEnv: ["./src/utils/test-utils/setupAfterEnv.ts"],
  moduleDirectories: ["node_modules", "utils", __dirname],
};
