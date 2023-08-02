module.exports = {
  preset: "jest-expo",
  roots: ["src"],
  setupFiles: ["react-native-css-interop/testing-library/setup"],
  setupFilesAfterEnv: [
    "react-native-css-interop/testing-library/setupAfterEnv",
  ],
};
