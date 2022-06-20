# Migrating from tailwindcss-react-native

Previously this project was called `tailwindcss-react-native`. If you are migrating from this project these are the breaking changes

## TailwindProvider is no longer required

The TailwindProvider is no longer required, unless you wish to inject styles or override default options for the library.

## CSS is the default for web

Nativewind defaults to CSS for web if using React Native Web >=0.18

You can control this setting via the `webOutput` option on `TailwindProvider`.

## useTailwind()

`useTailwind` no longer returns a callback and its options object has been updated

## spreadProps option on styled() has been removed

For most cases the classProps option should work as people expect, but due to issues with CSS this option was removed.
