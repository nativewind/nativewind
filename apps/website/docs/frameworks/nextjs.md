# Next.js

:::note

This guide assumes you already have Next.js configured with [React Native Web](https://github.com/vercel/next.js/tree/canary/examples/with-react-native-web) or [Next.js with Expo for Web](https://docs.expo.dev/guides/using-nextjs/)

:::

## Setup

Next.js has built in support for either Babel with PostCSS or SWC with PostCSS.

Next.js pages are often rendered via SSR which requires React Native Web 0.18 for proper CSS support.

### Babel

Follow the setup guide for [Babel (Transform Only)](../web/babel-transform-only.md) which allows you to use the inbuilt PostCSS pipeline.

### SWC

Follow the setup guide for [PostCSS (Web)](../web/postcss.md).
