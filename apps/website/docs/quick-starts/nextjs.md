# Next.js

NativeWind can be used in a Next.js project that is already configured to use Expo or vanilla React Native Web.

## 1. Setup Tailwind CSS

Simply configure Next.js as per [the Tailwind CSS Next.js setup guide](https://tailwindcss.com/docs/guides/nextjs)

## 2. Choose a compiler

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
