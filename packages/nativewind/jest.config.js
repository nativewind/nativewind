module.exports = {
  preset: "jest-expo",
  roots: ["src"],
  setupFiles: ["react-native-css-interop/test/setup"],
  setupFilesAfterEnv: ["react-native-css-interop/test/setupAfterEnv"],
};
