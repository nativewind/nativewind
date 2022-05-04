---
sidebar_position: 2
---

# Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

`tailwindcss-react-native` uses [Tailwind CLI](https://tailwindcss.com/docs/installation) to compile your classNames into high performant styles.

## 1. Install

First, you will need to install both `tailwindcss-react-native` and `tailwindcss`

<Tabs>
  <TabItem value="npm" label="NPM" default>

`npm install tailwindcss-react-native tailwindcss`

  </TabItem>
  <TabItem value="yarn" label="Yarn">

`yarn add tailwindcss-react-native tailwindcss`

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

As `tailwindcss-react-native` targets multiple platforms & frameworks, it supports multiple ways to setup compilation. We have multiple [setup guides](#setup-guides) for common project configurations.

> If you are setting up a project that doesn't have a setup guide we recommend using **Full Babel** which has the smallest setup and best out-of-the-box experience

The are four different categories of setups

<Tabs>
  <TabItem value="full-babel" label="Full Babel" default>

`npm install tailwindcss-react-native tailwindcss`

  </TabItem>

  <TabItem value="compile-only-babel" label="Compile-Only Babel">

`yarn add tailwindcss-react-native tailwindcss`

  </TabItem>

  <TabItem value="framework" label="BYO framework">

`yarn add tailwindcss-react-native tailwindcss`

  </TabItem>

  <TabItem value="cli" label="Use CLI">

`yarn add tailwindcss-react-native tailwindcss`

  </TabItem>
</Tabs>
