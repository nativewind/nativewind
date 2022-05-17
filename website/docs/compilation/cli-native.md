import StartCoding from "../\_start-coding-components.md"

# Tailwind CLI

The Tailwind CLI can be used to output precompiled RN StyleSheet objects.

## Setup

### 1. Create a PostCSS config file

```js
// postcss.config.js
module.exports = {
  plugins: {
    "tailwindcss-react-native/postcss": {
      output: "tailwindcss-react-native-output.js",
    },
  },
};
```

### 2. Add the native tailwind plugin to your `tailwind.config.js`

```diff
// tailwind.config.js
+ const tailwindcssReactNative = require("tailwindcss-react-native/tailwind/native")
+
module.exports = {
  content: [
    './App.{js,ts,jsx,tsx}',
  ],
+ plugins: [tailwindcssReactNative()],
};
```

### 2. Create a input file

```css
// input.css
@tailwind components;
@tailwind utilities;
```

### 3. Run Tailwind CLI

Running the Tailwind CLI will generate `tailwindcss-react-native-output.js`. This can be configured via the [PostCSS options](../configuration/postcss)

```bash
npx tailwindcss -i input.css --postcss postcss.config.js
```

### 4. Update the TailwindProvider

```diff
import { TailwindProvider } from 'tailwindcss-react-native'
+ import * as tailwindProviderProps from "./tailwindcss-react-native-output"

function MyAppsProviders ({ children }) {
    return (
-       <TailwindProvider>{children}</TailwindProvider>
+       <TailwindProvider {...tailwindProviderProps}>{children}</TailwindProvider>
    )
}
```

<StartCoding />

## Watching for changes

You can use the Tailwind CLI with the `--watch` flag to automatically compile on save.

This can be combined with [concurrently](https://www.npmjs.com/package/concurrently) to create a streamlined development environment.

```diff
// package.json
{
  "scripts": {
-   "start": "expo start"
+   "start": "concurrently \"tailwindcss -i input.css --postcss postcss.config.js --watch\" \"expo start\""
  },
  // ...
}
```
