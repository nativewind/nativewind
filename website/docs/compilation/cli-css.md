---
sidebar_position: 5
---

import ReactNativeWebPreview from "./\_react-native-web-0-18-preview.md"

# Tailwind CLI (CSS) 🔬

<ReactNativeWebPreview />

The Tailwind CLI can be used to generate CSS Stylesheets.

## 1. Setup Tailwind CSS

Follow the [setup guide for Tailwind CLI](https://tailwindcss.com/docs/installation).

## 2. Setup tailwindcss-react-native

Follow the [general setup instructions](../installation.md) to setup tailwindcss-react-native.

## 3. Update the TailwindProvider

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
+   "start": "concurrently \"tailwindcss -i input.css -o output.css --watch\" \"expo start:web\""
  },
  // ...
}
```
