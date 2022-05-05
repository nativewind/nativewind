---
sidebar_position: 201
---

# Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 1. Install

First, you will need to install both `tailwindcss-react-native` and `tailwindcss`

<Tabs>
  <TabItem value="npm" label="NPM" default>

`npm install --save-dev tailwindcss-react-native tailwindcss`

  </TabItem>
  <TabItem value="yarn" label="Yarn">

## Test

`yarn add --dev tailwindcss-react-native tailwindcss`

  </TabItem>
</Tabs>

## 2. Setup Tailwindcss

Tailwindcss requires a `tailwind.config.js` file with the content section configured to include the paths to all of your JavaScript components, and any other source files that contain Tailwind class names.

```js
// tailwind.config.js
module.exports = {
  plugins: [require("tailwindcss-react-native/plugin")],
  content: [
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
};
```

You can see additional customisation options on the [Tailwindcss website](https://tailwindcss.com/docs/configuration)

## 3. Add the TailwindProvider

Add `TailwindProvider` at the top level of your application

```tsx
import { TailwindProvider } from "tailwindcss-react-native";

function MyAppsProviders({ children }) {
  return <TailwindProvider>{children}</TailwindProvider>;
}
```

## 4. Setup compilation

As `tailwindcss-react-native` targets multiple platforms & frameworks, it supports multiple ways to setup compilation.

If you are using a framework, we recommending reading its specific framework guide, or follow a general compilation guide.

:::info
If you are unsure what guide to use, we recommend [Babel](./compilation/babel.md) which has the smallest setup and best out-of-the-box experience.
:::
