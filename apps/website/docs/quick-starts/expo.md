import StartCoding from "../\_start-coding.md"

# Expo

:::tip

A example of an Expo project can be found on [Github](https://github.com/marklawlor/nativewind/tree/next/examples/expo)

:::

## 1. Create the project

Create the project with the Expo CLI

```bash
npx create-expo-app my-app

cd my-app
```

You will need to install `nativewind` and it's peer dependency `tailwindcss`.

```bash
yarn add nativewind
yarn add --dev tailwindcss
```

## 2. Setup Tailwind CSS

:::caution

Do not set your content to `./**/*`! This will cause Tailwind CLI to scan every file in your `node_modules`.
For the fastest builds, be as specific as possible.

:::

Run `npx tailwindcss init` to create a `tailwind.config.ts` file

Run `npx tailwindcss init` to create a `tailwind.config.js` file

Add the paths to all of your component files in your tailwind.config.js file. Remember to replace `<custom directory>` with the actual name of your directory e.g. `screens`.

```diff
// tailwind.config.js
+ const nativewind = require("nativewind/tailwind")

module.exports = {
- content: [],
+ content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
+ presets: [nativewind]
}
```

## 3. Add the Babel preset

Modify your `babel.config.js`

```diff
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
-   presets: ["babel-preset-expo"],
+   presets: ["babel-preset-expo", "nativewind/babel"],
  };
};

```

<<<<<<< HEAD

## 4. Add the Metro config

=======
<StartCoding />

## Expo Web

When running on web, NativeWind is a compatability layer between [Tailwind CSS](http://www.tailwindcss.com) and React Native.

You will need follow a [Tailwind CSS installation guide](https://tailwindcss.com/docs/installation) and ensure NativeWind is transpiled.

### Example webpack setup

A complete setup can be found on the [Expo project example](https://github.com/marklawlor/nativewind/tree/next/examples/expo)

:::caution

Expo Web only supports Webpack 4, please ensure you are only installing webpack loaders that that support Webpack 4. For example, The latest version of `postcss-loader` is not compatible with Webpack 4 and instead, `postcss-loader@4.2.0` should be used.

> > > > > > > main

Run `npx expo customize metro.config.js` to create a `metro.config.js` file.

```diff
// metro.config.js
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
+ const withNativewind = require("nativewind/metro")

- module.exports = getDefaultConfig(__dirname)
+ module.exports = withNativewind(getDefaultConfig(__dirname))

```

<StartCoding />
