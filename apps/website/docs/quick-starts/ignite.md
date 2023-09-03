# Ignite

## 1. Create the project

Create the project with the Expo CLI

```bash
npx ignite-cli@latest new PizzaApp

cd my-app
```

You will need to install `nativewind` and it's peer dependency `tailwindcss`.

```bash
yarn add nativewind
yarn add --dev tailwindcss
```

## 2. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.js` file

Add the paths to all of your component files in your tailwind.config.js file.

```diff title=tailwind.config.js

module.exports = {
+ presets: [require("nativewind/preset")],
- content: [],
+ content: ["./app/components.{js,jsx,ts,tsx}", "./ignite/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Create a CSS file

```css title=global.css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## 3. Add the Metro preset

Make sure `<your-css-file>.css` matches path relative to the CSS file you created in the last step.

```diff title=metro.config.js
+ const { withNativeWind } = require('nativewind/metro');
const { getDefaultConfig } = require("metro-config")
const { getDefaultConfig: getDefaultExpoConfig } = require("@expo/metro-config")

- module.exports = metroConfig
+ module.exports = withNativeWind(metroConfig)
```

## 4. Add the Babel preset

Modify your `babel.config.js`

```diff title=babel.config.js
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

```diff title=App.tsx
// This is the entry point if you run `yarn expo:start`
// If you run `yarn ios` or `yarn android`, it'll use ./index.js instead.
import App from "./app/app.tsx"
import React from "react"
import { registerRootComponent } from "expo"
import { Platform } from "react-native"
import * as SplashScreen from "expo-splash-screen"

+ import "./global.css"

SplashScreen.preventAutoHideAsync()

function IgniteApp() {
  return <App hideSplashScreen={SplashScreen.hideAsync} />
}

if (Platform.OS !== "web") {
  registerRootComponent(IgniteApp)
}

export default IgniteApp
```

<StartCoding />
