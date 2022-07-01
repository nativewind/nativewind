import StartCoding from "../\_start-coding-components.md"

# PostCSS

You to use the PostCSS to generate CSS stylesheets. You can then use className to style your React Native Web components using CSS.

:::caution
This setup requires React Native Web 0.18
:::

## Setup

### 1. Setup Tailwind CSS

Follow the [setup guide for Tailwind PostCSS](https://tailwindcss.com/docs/installation/using-postcss).

### 2. Add the NativeWind plugin to your `tailwind.config.js`

```diff
// tailwind.config.js
+ const nativewind = require("nativewind/tailwind/css")
+
module.exports = {
  content: [
    './App.{js,ts,jsx,tsx}',
  ],
+ plugins: [nativewind()],
};
```

<StartCoding />
