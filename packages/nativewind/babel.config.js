module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "@babel/plugin-transform-private-methods",
      {
        loose: true,
      },
    ],
  ],
};
