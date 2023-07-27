import StartCoding from "../\_start-coding.md"

# Expo Router

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
- content: [],
+ content: ["./app/**/*.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```css
// global.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
  },
};
```

## 5. Add the Babel plugin

Modify your `babel.config.js`

```diff
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-reanimated/plugin",
      require.resolve("expo-router/babel"),
+     "nativewind/babel",
    ],
  };
};

```

## 6. Enable CSS Support in Expo's Metro Config

```js
// metro.confgi.js
const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

module.exports = config;
```

## 7. Create a `app/_layout` file

```js
import { Slot } from "expo-router";

import "../global.css";

export default function () {
  return <Slot />;
}
```

<StartCoding />
