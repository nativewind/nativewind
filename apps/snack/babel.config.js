module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        "babel-preset-expo",
        {
          jsxRuntime: "classic",
        },
      ],
    ],
    plugins: ["react-native-reanimated/plugin"],
  };
};
