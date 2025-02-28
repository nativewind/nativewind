---
title: Using with Monorepos
description: Learn how to set up NativeWind in monorepo environments like NX
---

# Using with Monorepos

NativeWind can be used in an Nx Monorepo that is already configured to use Expo and the corresponding plugin [@nx/expo](https://nx.dev/nx-api/expo)

## NX Monorepo Setup

When working with NativeWind in an NX monorepo, there are some specific configurations needed to ensure proper integration. The main challenge is correctly configuring the Metro bundler to work with both NX and NativeWind.

### Prerequisites

Simply configure your Expo project in Nx as per [the Expo setup guide](./installation)

:::info

Skip the `metro.config.js` setup as we will address this part here.

:::

### Modify your metro.config.js

Add the NativeWind plugin to your `metro.config.js` using a promise chain as shown below:

```js title="metro.config.js"
const { withNativeWind } = require("nativewind/metro");

// ... existing Nx configuration

module.exports = withNxMetro(mergeConfig(defaultConfig, customConfig), {
  // ... existing Nx config
}).then((config) => withNativeWind(config, { input: "./global.css" }));
```

## Additional Resources

For more complex monorepo setups or specific issues, refer to:

- [NX documentation for React Native](https://nx.dev/recipes/react/react-native)
- [NX documentation for Expo](https://nx.dev/nx-api/expo)
- [Expo documentation for monorepos](https://docs.expo.dev/guides/monorepos/)