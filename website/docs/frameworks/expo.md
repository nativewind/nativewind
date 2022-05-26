# Expo

If you are using Expo with a framework (Next.js, Gatsy, Storybook, etc), please follow their respective guides.

Otherwise you can setup Expo by using Babel or the Tailwind CLI

- [Babel](../compilation/babel.md)
- [Babel (Compile Only)](../compilation/babel-compile-only.md)
- [Tailwind CLI](../compilation/cli-native.md)

## Expo Web

If you are using Expo Web without a framework, you will need to add a custom webpack configuration file.

```tsx
// webpack.config.js
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["tailwindcss-react-native"],
      },
    },
    argv
  );

  return config;
};
```
