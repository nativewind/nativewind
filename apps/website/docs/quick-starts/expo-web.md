import StartCoding from "../\_start-coding.md"

# Expo Web

When running on web, NativeWind is a compatability layer between [Tailwind CSS](http://www.tailwindcss.com) and React Native.

## Follow the Expo setup

Please complete the [Expo Quick Start](./expo.md)

## Create a css file

```diff
// main.css
+ @tailwind base
+ @tailwind components
+ @tailwind utilities;
```

## Import it into your App.js

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

## Update your Webpack config

:::caution

Expo Web only supports Webpack 4, please ensure you are only installing webpack loaders that that support Webpack 4. For example, The latest version of `postcss-loader` is not compatible with Webpack 4 and instead, `postcss-loader@4.2.0` should be used.

https://github.com/expo/expo-cli/pull/3763

:::

```tsx
// webpack.config.js
const path = require("path");
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

  config.module.rules.push({
    test: /\.css$/i,
    use: ["postcss-loader"],
  });

  return config;
};
```

## Expo SDK <=45

NativeWind does not support Expo Web on SDK <=45.
