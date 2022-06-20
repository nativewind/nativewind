# Expo

If you are using Expo with a framework (Next.js, Gatsby, Storybook, etc), please follow their respective guides.

Otherwise you can setup Expo by using Babel or the Tailwind CLI

- [Babel](../native/babel.mdx)
- [Babel (Compile Only)](../native/babel-compile-only.md)

## Additional setup for Expo Web

### Webpack setup

If you are using Expo Web without a framework, you will need to add a custom webpack configuration file.

```tsx
// webpack.config.js
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      babel: {
        dangerouslyAddModulePathsToTranspile: ["nativewind"],
      },
    },
    argv
  );

  return config;
};
```

### Output

Expo SDK <45 does not support React Native Web 0.18 and cannot output the class attribute on components. You need to add a `<TailwindProvider />` to the root of your application to change the `webOutput` option to `native`

```tsx
// App.js

import { TailwindProvider } from "nativewind"

export default function App() {
  return (
    <TailwindProvider webOutput="native">
      { // your app }
    </TailwindProvider>
  )
}
```
