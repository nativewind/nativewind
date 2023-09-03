# Next.js

NativeWind can be used in a Next.js project that is already configured to use Expo or vanilla React Native Web.

## 1. Setup Tailwind CSS

Simply configure Next.js as per [the Tailwind CSS Next.js setup guide](https://tailwindcss.com/docs/guides/nextjs)

## 2. Add the NativeWind plugin

NativeWind adds some extra Tailwind features such as platform variants. You will need to add the `nativewind/tailwind/css` if you use these features.

```diff
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
  ],
+ plugins: [require('nativewind/tailwind/css')],
  theme: {
    extend: {},
  },
}
```

## 3. Choose a compiler

### Via SWC

NativeWind does not yet have an SWC transformer. If you wish to use SWC you will need to wrap your components in `styled()`

### Via Babel

As Next.js is compiling your styles, you can run the Babel plugin in 'transformOnly' mode.

```diff
// babel.config.js
module.exports = {
- plugins: [],
+ plugins: ['nativewind/babel', { mode: 'transformOnly' }],
};
```

## 4. Common issues

A common issue with Next.js is your styles are imported, but are being overridden by React Native Wind. This is due to the order stylesheet imports.

A simple fix is simply make the Tailwind styles a higher specificity.

```diff
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
