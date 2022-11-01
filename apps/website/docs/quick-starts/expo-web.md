import StartCoding from "../\_start-coding.md"

# Expo Web

:::caution

NativeWind does not support:

- SDK <=45: NativeWind requires React Native Web 0.18 which was added in SDK 46.
- Expo Metro: As it [does not support bundling CSS](https://docs.expo.dev/guides/customizing-metro/#expo-webpack-vs-expo-metro)
- Expo Router: It requires Expo Metro

:::

When running on web, NativeWind is a compatability layer between the generated CSS from [Tailwind](http://www.tailwindcss.com) and React Native Web.

## Follow the Expo setup

Please complete the [Expo Quick Start](./expo.md)

## 1. Create a css file

```diff
// main.css
+ @tailwind base
+ @tailwind components
+ @tailwind utilities;
```

## 2. Import it into your App.js

:::info

NativeWind's babel plugin will ensure this works for your native builds as well!

:::

```diff
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

+ import "./main.css"

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

## 3. Update your Webpack config

:::caution

Expo Web only supports Webpack 4, please ensure you are only installing webpack loaders that that support Webpack 4.

https://github.com/expo/expo-cli/pull/3763

Hot reloading with `postcss` & `@expo/webpack-config` has known issues on some systems.
We are open to PRs if you know how to fix this issue.

:::

`npm i -D postcss-loader@4.2.0`

```diff
// webpack.config.js
const path = require("path");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
+     babel: {
+       dangerouslyAddModulePathsToTranspile: ["nativewind"],
+     },
    },
    argv
  );

+ config.module.rules.push({
+   test: /\.css$/i,
+   use: ["postcss-loader"],
+ });

  return config;
};
```
