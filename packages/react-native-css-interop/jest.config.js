module.exports = {
  preset: "jest-expo/ios",
  roots: ["src"],
  setupFiles: ["./src/utils/test/setup.ts"],
  setupFilesAfterEnv: ["./src/utils/test/setupAfterEnv.ts"],
  moduleDirectories: ["node_modules", "utils", __dirname],
};
