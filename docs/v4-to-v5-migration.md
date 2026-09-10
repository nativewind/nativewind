# Migrating an Expo application from Nativewind v4 to v5

Draft for the Expo 57 release candidate. No RC has been published. The final installation command must use the exact verified Nativewind and react-native-css registry versions. Local development archive names are not public package versions.

## Establish a baseline

Create a branch and preserve the application lockfile. Record the Expo SDK, React Native, React, Reanimated, Worklets, Tailwind, and Nativewind versions. Capture the existing application on every supported platform, including theme changes, interactive components, animations, and third party components that receive mapped props.

Upgrade the application to the selected Expo SDK using Expo's dependency alignment. For this candidate, the verification target is Expo 57.0.21, React 19.2.3, React Native 0.86.3, Reanimated 4.5.1, and Worklets 0.10.1. Do not independently advance Reanimated or Worklets beyond the verified Expo pair. Resolve duplicate runtime packages before judging styling failures.

## Replace the configuration

V5 uses Tailwind 4 and react-native-css. Remove the v4 Nativewind Babel preset and JSX import source setting where they were added for Nativewind. Preserve unrelated Babel plugins. The verified Expo consumer uses:

```js
module.exports = { presets: ['babel-preset-expo'] };
```

Use the v5 Metro wrapper spelling:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');
module.exports = withNativewind(getDefaultConfig(__dirname));
```

Configure PostCSS with `@tailwindcss/postcss` and import the stylesheet once from the application entry or Router root layout:

```css
@import "tailwindcss";
@import "nativewind/theme";
```

Migrate project theme extensions and plugins deliberately to Tailwind 4 configuration. Do not delete custom v4 configuration until each custom token, variant, plugin, and source location has a replacement. Register shared workspace sources with `@source` relative to the stylesheet when automatic discovery does not include them. Keep complete utility strings in source.

## Review application contracts

For Expo, set `expo.userInterfaceStyle` to `automatic` and install the Expo aligned `expo-system-ui` package for Android. Rebuild the native app after changing native configuration. An absent appearance setting defaults to Light, which prevents restoring an app override from following a dark system preference. See [Expo color theme configuration](https://docs.expo.dev/develop/user-interface/color-themes/).

Use `dark:` with the default media query contract. On native, import `Appearance` and `useColorScheme` from React Native. Call `Appearance.setColorScheme('light')` or `'dark'` for a manual preference and `'unspecified'` to restore system preference on this target. Verify restoration on a device. Browser media query behavior needs a separate browser check. Do not add an ancestor dark class merely to implement the native default.

Review custom styled component and prop mapping wrappers against the v5 API. The engine supports `nativeStyleMapping`; its deprecated `nativeStyleToProp` alias remains accepted, with the current option taking precedence. `target: false` discards unmapped compiled styles while preserving original inline styles. Do not mechanically rename v4 wrapper APIs without checking their prop destinations and update behavior.

For mapping paths containing `&`, use bracketed utility syntax such as `@map-[&.test]:color-black`. Test discovery from actual application source. Forcing a utility through an inline declaration does not prove automatic source scanning.

Legacy `@cssInterop` configuration, `@react-native config` directives, and class qualified root selectors now produce explicit migration errors. Use the contracts documented in `v5-engine-contracts.md` instead of suppressing those errors.

## Give transitions numeric endpoints

An unspecified width is `auto`, not numeric zero. When a width should interpolate, use explicit numeric classes in both states, for example `w-0` and `w-[100px]`, together with the same transition duration and timing classes. To animate a collapse, switch back to `w-0` rather than removing the width class. Avoid an inline width that overrides the class you intend to animate.

The physical iPhone verification measures zero to 100, 100 to 200, and 100 to zero alongside a direct Reanimated reference. These explicit numeric transitions pass; the historical tests assuming automatic zero endpoints fail and remain retained. This is a clarified contract, not evidence that the old automatic behavior was restored.

## Verify the migrated application

1. Install from the final exact registry pair into a clean checkout and retain the lockfile. Confirm one React, React Native, react-native-css, Reanimated, and Worklets installation per application runtime.
2. Run application type checks and production bundles for every supported platform. Exercise Router navigation and direct route loading where applicable.
3. Verify representative layout, typography, variables, mapped props, theme selection and restoration, gestures, and intermediate and final animation frames against the preserved baseline.
4. Run development refresh checks. Change a utility and a CSS value, remove a utility, and verify rendered changes while component state persists.
5. Include an intentionally incorrect style in the verification fixture and confirm the measurement rejects it. Remove that defect and verify recovery.
6. Record package versions, source revision, lockfile hash, build identity, device or browser, observed results, and known limitations. Keep inconclusive checks separate from passes.

Android animation cancellation has a tracked Reanimated limitation: the final transform can remain after cancellation. See `known-issues.md`. Do not claim the application passed that case or silently ship the diagnostic dependency patch.

The public migration skill will follow the verified RC contract and will be tested in fresh migration sessions. This draft guide is not evidence that those sessions or registry installation checks have passed.
