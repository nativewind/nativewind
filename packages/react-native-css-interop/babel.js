/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
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
      "react-native-reanimated/plugin",
    ],
  };
};
