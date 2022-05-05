---
sidebar_position: 4
sidebar_label: PostCSS (CSS) 🔬
---

import ReactNativeWebPreview from "./\_react-native-web-0-18-preview.md"

# Using PostCSS (CSS) 🔬

<ReactNativeWebPreview />

## 1. Setup Tailwind CSS

Follow the [Using PostCSS](https://tailwindcss.com/docs/installation/using-postcss) to setup Tailwind CSS

## 2. Setup tailwindcss-react-native

Follow the [general setup instructions](../installation.md) to setup tailwindcss-react-native.

## 3. Enable preview features

You will need to enable preview features on your `TailwindProvider`

```diff
import { TailwindProvider } from 'tailwindcss-react-native'

function MyAppsProviders ({ children }) {
  return (
-   <TailwindProvider>{children}</TailwindProvider>
+   <TailwindProvider preview={true}>{children}</TailwindProvider>
  )
}
```

## 4. Write components using the Component API

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function BoldText(props) {
  return <StyledText className="font-bold" {...props} />;
}
```
