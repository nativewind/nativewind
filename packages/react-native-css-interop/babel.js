module.exports = function () {
  return {
    plugins: [
      require("./dist/babel-plugin").default,
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "react-native-css-interop",
        },
      ],
      // Reanimated 4 forwards to Worklets; Reanimated 3 keeps its own plugin.
      "react-native-reanimated/plugin",
    ],
  };
};
