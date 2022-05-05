---
sidebar_position: 5
---

# Tailwind CLI (RN StyleSheets)

The Tailwind CLI can be used to output precompiled RN StyleSheet objects.

## 1. Setup tailwindcss-react-native

Follow the [general setup instructions](../installation.md) to setup tailwindcss-react-native.

## 2. Create a PostCSS config file

```js
// postcss.config.js
module.exports = {
  plugins: [
    [
      require("tailwindcss-react-native/postcss"),
      {
        /* options */
      },
    ],
  ],
};
```

## 3. Create a input file

```css
// input.css
@tailwind components;
@tailwind utilities;
```

## 3. Run Tailwind CLI

```bash
npx tailwindcss -i input.css --postcss postcss.config.js
```

This will create `tailwindcss-react-native-output.js`

## 4. Update the TailwindProvider

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

## 5. Write components using the Component API

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function BoldText(props) {
  return <StyledText className="font-bold" {...props} />;
}
```

## 6. Update your scripts (optional)

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
