---
sidebar_position: 2
---

# Next.js

:::note

This guide assumes you already have Next.js configued with [React Native Web](https://github.com/vercel/next.js/tree/canary/examples/with-react-native-web) or [Next.js with Expo for Web](https://docs.expo.dev/guides/using-nextjs/)

:::

## 1. Setup compilation

As Next.js applications run on the web, you will most likely want to output CSS by following [PostCSS (CSS) 🔬](../compilation/postcss-css.md). This will provide the best performance and features and allow you to use the [SWC compiler](https://nextjs.org/docs/advanced-features/compiler).

You can still use React Native StyleSheets by following one of these guides:

- [Babel](../compilation/babel.md)
- [Babel (Compile Only)](../compilation/babel-compile-only.md)
- [PostCSS (RN StyleSheet)](../compilation/postcss-native.md)
- [Tailwind CLI (RN StyleSheet)](../compilation/cli-native.md)

## 2. Setup transpilation

Unlike Metro, Next.js does not transpile `node_modules`. You will need to add [next-transpile-modules](https://github.com/martpie/next-transpile-modules) to your `next.config.js`

```
npm install --save-dev next-transpile-modules
```

Follow the [setup instructions](https://github.com/martpie/next-transpile-modules#usage) to add `tailwindcss-react-native`

```js
// An example next.config.js
const withTM = require("next-transpile-modules")([
  "tailwindcss-react-native",
  "@react-native-community/hooks", // A dependancy used at runtime
]);

module.exports = withTM({});
```
