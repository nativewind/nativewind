import StartCoding from "../\_start-coding.md"

# Expo

## 1. Create the project

Create the project with the Expo CLI

```bash
expo init AwesomeProject

cd AwesomeProject
```

You will need to install `nativewind` and it's peer dependency `tailwindcss`.

```bash
yarn add nativewind
yarn add --dev tailwindcss
```

## 2. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.ts` file

Add the paths to all of your component files in your tailwind.config.js file.

```diff
// tailwind.config.js

module.exports = {
- content: [],
+ content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 3. Add the Babel plugin

Modify your `babel.config.js`

```diff
// babel.config.js
module.exports = {
- plugins: [],
+ plugins: ["tailwindcss-react-native/babel"],
};
```

<StartCoding />

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

### React Native Web 0.17

Expo SDK <=45 only supports React Native Web 0.17 which cannot output classNames. You need to add a `<TailwindProvider />` to the root of your application to change the `webOutput` option to `native`. This will cause your web app to behave exactly like a native app.

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
