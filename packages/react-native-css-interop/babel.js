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
      // Use this plugin in reanimated 4 and later
      "react-native-worklets/plugin",
    ],
  };
};
