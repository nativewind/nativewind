# Migrating v2 -> v3

NativeWind v3 has a number of breaking changes, however for most projects they should simply need to update their project setup.

## New Project setup

Native apps now require a **Metro plugin**

```tsx
// Example metro.config.js for an Expo project
// Expo is not required, you just need to wrap your config using withNativewind
const { getDefaultConfig } = require("expo/metro-config");
const withNativewind = require("nativewind/metro");

module.exports = withNativewind(getDefaultConfig(__dirname));
```

Babel now uses a **preset** instead of a plugin

```diff
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
-   plugins: ["nativewind/babel"]
    presets: [
      "babel-preset-expo",
+     "nativewind/babel"
    ],

  };
};
```

Tailwind now requires a **preset** instead of a plugin

```diff
// tailwind.config.js
+ const nativewind = require("nativewind/tailwind")

module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./<custom directory>/**/*.{js,jsx,ts,tsx}"],
+ presets: [nativewind],
- plugins: [nativewind],
  theme: {
    extend: {},
  },
}
```

## Breaking Changes

### Web exclusively uses CSS styles

NativeWind on web now only works with CSS styling. The minimum version of React Native Web is now v0.18.

> There is known issue where React Native Web crashes when using NativeWind on `Animated` components.
> You will need to update to the [React Native Web 0.19 preview](https://github.com/necolas/react-native-web/pull/2377)

### Base scaling has changed

NativeWind now supports the `rem` unit. This is a breaking change as it will affect all `rem` based styles.

Previously, NativeWind 1-1 matched the scaling of TailwindCSS documentation and overrode the `rem` values with their `px` equivalent. ([example scaling](https://tailwindcss.com/docs/font-size))

This was undesirable, as components styled with NativeWind were different to the base component. For example, NativeWind's text was slightly larger than the default.

```tsx
<Text> // fontSize: 14
<Text className="text-base" /> // fontSize: 16
```

Now that NativeWind supports `rem`, we can use an `rem` value of 14 to match the default `<Text />`.

The result of this is your app may "shrink", as everything scales down from the previous static 16px to the new 14.

You can restore the old behaviour by setting `NativeWindStyleSheet.setVariables({ '--rem': 16 })`

### Dark mode

- React Native projects will need to set `darkMode: 'class'` to enable manually controlling the color scheme
- React Native Web projects will need to follow the [Tailwind documentation](https://tailwindcss.com/docs/dark-mode#supporting-system-preference-and-manual-selection) if they wish for dark mode to honor the system preference while in `darkMode: class`

This aligns NativeWind's functionality with TailwindCSS [handling of Dark Mode](https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually)

### styled() props options

The `classProps` option for styles has been removed. This has been merged into `props`.

The option `baseClassName` has been renamed to `className`

The `props` option still allows you to style non-`style` props but is now more flexible. Like before it is an object that accepts the name of component props, and it's value configures how that prop is mapped.

If the value is a Boolean, NativeWind will so transform that prop (but not rename it)

If the value is a String, NativeWind will transform and rename that prop. This is useful if you have a prop `innerStyle` but you'd like to expose it as `innerClassName`

Lastly, it accepts an object with the option

```tsx
{
  name?: string,
  value?: keyof Style,
  class?: Boolean
}
```

`name` renames the prop, same as simply providing a string.

`value` extracts the style value from the ste object. This is the same behaviour that NativeWind used to do if you provide a string.

`class` a Boolean that indicates that this prop should only be transformed on native. On web, it will be pre-pended to the `className` string. This replaces the old `classProps` option.

### Theme functions

Theme functions like `hairlineWidth` and `platformSelect` are now exported from `nativewind/theme`. You will need to update your imports.

### `group` and `parent`

`group-isolate` has been replaced with [nested groups](https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups). This feature requires TailwindCSS 3.2

The parent variant has been removed and should be replaced with nested groups. The `parent` class still exists, but is only used for new variants like `odd:`/`even:`

### Other removed features

- NativeWind no longer exports a PostCSS plugin. This was mostly used for troubleshooting, for which there are now better methods.
- The polyfill for `aspect` with ratio values has been removed. Has been added to [React Native ](https://github.com/facebook/react-native/pull/34629). If you require this feature and cannot upgrade you can define your aspect ratios in your theme.
- `NativeWindStyleSheet.setOutput()` has been removed
