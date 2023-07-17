module.exports = function () {
  return {
    plugins: [
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "react-native-css-interop",
        },
      ],
      'react-native-reanimated/plugin'
    ],
  };
};
