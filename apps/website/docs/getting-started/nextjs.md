# Next.js

NativeWind can be used in a Next.js project that is already configured to use Expo or vanilla React Native Web.

Setting up a new Next.js project to use React Native Web is out of scope for these instructions.

## 1. Setup Tailwind CSS

Simply configure Next.js as per [the Tailwind CSS Next.js setup guide](https://tailwindcss.com/docs/guides/nextjs)

## 2. Add the NativeWind preset

NativeWind adds some extra Tailwind features such as platform variants.

```diff title=tailwind.config.js

module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
+ presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
}
```

## 3. Update import source

Next.js uses a `jsconfig.json`/`tsconfig.json` file to configure the `jsxImportSource`.

```json title=tsconfig.json
{
  "compilerOptions": {
    "jsxImportSource": "nativewind"
  }
}
```

## Common issues

### Errors about package imports.

This signals that you have incorrectly setup React Native Web and most likely need to add additional packages to `transpilePackages`. This is out of scope for NativeWind.

### Styles are not being applied

A common issue with Next.js is your styles are imported, but are being overridden by another StyleSheet due to the order stylesheet imports.

A simple fix is simply make the Tailwind styles a higher specificity.

```diff title=tailwind.config.json
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
  plugins: [require('nativewind/tailwind/css')],
+ important: 'html',
  theme: {
    extend: {},
  },
}
```
