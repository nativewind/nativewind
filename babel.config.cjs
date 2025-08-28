module.exports = (api) => {
  const isTest = api.env("test");

  if (isTest) {
    return {
      presets: ["babel-preset-expo"],
    };
  } else {
    return {
      overrides: [
        {
          exclude: /\/node_modules\//,
          presets: ["module:react-native-builder-bob/babel-preset"],
        },
        {
          include: /\/node_modules\//,
          presets: ["module:@react-native/babel-preset"],
        },
      ],
    };
  }
};
