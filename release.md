> This is a work in progress - these features are not final

NativeWind 3.0 is a major update for NativeWind that fixes a large variety of issues. For most users the upgrade will be simple and should only require a small configuration change.

## Why a new major version

NativeWind 3.0 adds many new features that require breaking changes to the compiled styles. Additionally it also streamlines the project setup across all platforms, which requires minor updates to projects configuration.

NativeWind 3.0:

- reduces the runtime code by XX%
- only has two runtime dependencies (`react-is` and the `use-sync-external-store` shim

## New Features

### CSS Variables

One of the sore points of compiled styles is static theming. Dynamic theme values are required for variety of reasons are often used by existing Tailwind libraries.

### REM Units

Many developers use `rem` units to ensure consistent scaling across their application. NativeWind now mimics this behaviour using the CSS variable `--rem`, which defaults to `16`. Developers can change their either by adding a `font-size` to `:root` or by calling `NativeWindStyleSheet.setRem()`

### RTL Support

The `rtl` and `ltr` variants are now supported. Developers can quickly change this value via `NativeWindStyleSheet.setDirection()` or `NativeWindStyleSheet.toggleDirection()`

### Odd/Even/First/Last

The `odd/even/first/last` variants are now supported for styling children.

### Startup performance

NativeWind 3.0 uses deduplicated styles when compiling for production, significantly improving startup time

### Cache issues

A number of caching issues, expecially during local development have been fixed. There are still some edge cases, but you shouldn't need to reset your babel cache as often.

### Bug Fixes

- `group`/`group-isolate`/`parent` now work as expected
- Fixed edge cases where modifiers and variants did not apply correctly

## Experimental Features

### CSS Styles

As stated in the projects goals, NativeWind is not trying to build a full featured css engine, just enough to make using Tailwind comfortable. However a side-effect of the new project setup is that user-supplied css can be added to the NativeWind compiler. This allows developers to write custom CSS classes and use features like `@apply` without learning Tailwind's plugin system.

This will be an indefinitely experimental feature.

## New project setup

NativeWind previously had suble differences in it's setup for React Native and Web. This often causes confusion for React Native developers who were not familiar with Tailwind's web setup. Additionally, developers who wanted to tinker with NativeWind's internals found that they were locked out of various options.

As one of NativeWind's goals is to "align with Tailwind CSS", NativeWind 3.0 introduces a new project setup that is closer to Tailwind CSS's setup and exposes its internals a bit better.

For most web frameworks, Tailwind CSS doesn't "just work" and requires a "@tailwind" at-rule to trigger its compilation. NativeWind now requires the same trigger

For e

```diff
// global.css
+ @tailwind base;
+ @tailwind components;
+ @tailwind utilities;

// App.tsx
import { Text, View } from "react-native";

+ import "./styles.css";

export function Test() {
  return (
    <View className="container">
      <Text>Hello world!</Text>
    </View>
  );
}
```

While it may seem usual for a React Native project to import a `.css` file, it's a concept web developers have been familiar with for sometime.

Additionally, NativeWind's plugins & configuration is now exposed as single Tailwind preset. Adding the preset is now required for all projects.

```diff
// tailwind.config.js
+ const nativewind = require("nativewind/tailwind")

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
+ presets: [nativewind],
}
```
