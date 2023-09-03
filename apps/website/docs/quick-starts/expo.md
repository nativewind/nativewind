import StartCoding from "../\_start-coding.md"

# Expo

## 1. Create the project

Create the project with the Expo CLI

```bash
npx create-expo-app@latest -e with-router
```

You will need to install `nativewind` and it's peer dependency `tailwindcss`.

```bash
yarn add nativewind
yarn add --dev tailwindcss@3.3.2
```

## 2. Upgrade to Expo SDK 49

```bash
npm install expo@^49.0.0 or yarn add expo@^49.0.0
npx expo install --fix
```

## 3. Create your first route

```
npm start
```

Open your app on any device and follow the onscreen instructions.

## 4. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.js` file

Add the paths to all of your component files in your tailwind.config.js file. Remember to replace `<custom directory>` with the actual name of your directory e.g. `screens`.

This is the same as follow the `Using PostCSS` instructions: https://tailwindcss.com/docs/installation/using-postcss

```diff
// tailwind.config.js

module.exports = {
+ presets: [require("nativewind/preset")],
- content: [],
+ content: ["./app/**/*.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create a CSS file

```css
// global.css

@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. Add the Metro preset

Make sure `<your-css-file>.css` matches path relative to the CSS file you created in the last step.

```diff
+ const { getDefaultConfig } = require("expo/metro-config");
+ const { withNativeWind } = require('nativewind/metro');

+ const config = getDefaultConfig(__dirname, {
+   isCSSEnabled: true,
+ });

+ module.exports = withNativeWind(config, {
+   input: '<your-css-file>.css'
+ })
```

## 4. Add the Babel preset

Modify your `babel.config.js`

```diff
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
-   presets: ["babel-preset-expo"],
+   plugins: ["babel-preset-expo", "nativewind/babel"],
  };
};
```

## 5. Input your CSS file

Input your `<your-css-file>.css` that you created in step 3.

```diff
// App.tsx
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

+ import "./global.css"

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

<StartCoding />
