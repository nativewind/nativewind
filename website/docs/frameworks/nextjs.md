# Next.js

:::note

This guide assumes you already have Next.js configured with [React Native Web](https://github.com/vercel/next.js/tree/canary/examples/with-react-native-web) or [Next.js with Expo for Web](https://docs.expo.dev/guides/using-nextjs/)

:::

## Setup

### 1. Compilation

Next.js has built in support for both Babel and PostCSS, so either compilation guide is suitable. You can also manually setup the Tailwind CLI.

- [Babel](../compilation/babel.md)
- [Babel (Compile Only)](../compilation/babel-compile-only.md)
- [PostCSS](../compilation/postcss-native.md)
- [Tailwind CLI](../compilation/cli-native.md)

If you willing to try bleeding-edge features, you can also use Next.js to output CSS style sheets by following [PostCSS (CSS) 🔬](../compilation/postcss-css.md). This will provide the best performance and features and allow you to use the [SWC compiler](https://nextjs.org/docs/advanced-features/compiler).

### 2. Transpilation

Unlike Metro, Next.js does not transpile `node_modules`. You will need to add [next-transpile-modules](https://github.com/martpie/next-transpile-modules) to your `next.config.js`

```
npm install --save-dev next-transpile-modules
```

Follow the [setup instructions](https://github.com/martpie/next-transpile-modules#usage) to add `tailwindcss-react-native`

```js
// An example next.config.js
const withTM = require("next-transpile-modules")([
  "tailwindcss-react-native",
  "@react-native-community/hooks", // A dependency used at runtime.
]);

module.exports = withTM({});
```
