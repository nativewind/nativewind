module.exports = {
  presets: ["module:babel-preset-expo"],
  plugins: [
    [
      "@babel/plugin-transform-private-methods",
      {
        loose: true,
      },
    ],
  ],
};
