---
sidebar_position: 300
---

# Next.js with SWC 🔬

:::caution
Next.js with SWC is currently in preview and requires [Web with CSS Stylesheets](/platforms/web#css-stylesheets-).
:::

Nextjs 12.x.x+ introduces the SWC compiler as a replacement for Babel, which provides many benefits such as faster compilation time.

As SWC does not currently offer a plugin interface, however we can use Next.js's inbuilt Postcss engine to compile our styles to CSS Stylesheets.

This guide assumes you have already configured Next.js to work with React Native Web. All setups are supported (custom webpack, expo web, expo w/ next-adapter, etc).

## 1. Setup tailwindcss-react-native

Follow the [general setup instructions](/installation) to setup tailwindcss-react-native.

## 2. Setup Tailwindcss for Next.js

Follow the [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs) instructions on the Tailwind CSS website.

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

## 5. Set `important`

You may find that stylesheet created via Next.js conflicts with React Native Web's default stylesheet. You can fix this by increasing the precedence of the Tailwind CSS rules. The simplest way to achieve this is adding `important: "html"` to your `tailwind.config.js`.

```diff
// tailwind.config.js
module.exports = {
  plugins: [require("tailwindcss-react-native/plugin")],
+ important: "html",
  content: [
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
};
```
