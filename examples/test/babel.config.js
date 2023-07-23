module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // Required for expo-router
      "expo-router/babel",
      [
        "@babel/plugin-transform-react-jsx",
        {
          runtime: "automatic",
          importSource: "nativewind",
        },
      ],
    ],
  };
};
