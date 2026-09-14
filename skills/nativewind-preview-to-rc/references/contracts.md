# Preview 4 to RC0 contracts

The source pair is Nativewind 5.0.0-preview.4 with react-native-css 3.0.7. The destination pair is Nativewind 5.0.0-rc.0 with react-native-css 3.1.0-rc.0.

The [published release notes](https://github.com/nativewind/nativewind/releases/tag/5.0.0-rc.0) and [compatibility guide](https://github.com/nativewind/nativewind/blob/main/docs/rc-compatibility.md) are authoritative for this pinned target.

Legacy `@cssInterop` and `@react-native` configuration was silently ignored by the previous engine and now produces errors. Determine the intended behavior before removing a directive. Theme selection on native uses React Native Appearance; runtime variables that must not be inlined use the Metro compiler option `inlineVariables.exclude`. Preserve actual values and customizations; record unsupported intent explicitly.

Qualified native root selectors such as `:root.dark` are rejected. For default native dark variants, use `prefers-color-scheme` media queries. Set `expo.userInterfaceStyle` to `automatic` and include Expo aligned `expo-system-ui` for Android. Use `Appearance.setColorScheme('dark')` or `'light'` for a native override and `'unspecified'` to restore the system preference on this target. Browser class toggles require their own browser behavior and must not be globally replaced by native Appearance calls.

Props `placeholderClassName`, `indicatorClassName`, `presentationClassName`, `cssInterop`, and StatusBar `className` no longer have declarations for mappings the v5 runtime did not support. For TextInput placeholder color use supported `placeholder:` utilities, or explicit `placeholderTextColor`. For custom components use supported native props or the `styled` mapping API after checking destination and precedence. Do not blindly rewrite all className wrappers or erase meaningful explicit props.

The RC accepts deprecated `nativeStyleToProp`, `vars()` and the Nativewind color scheme hook. Their continued presence is not a migration failure. Length variables shared across web and native need units, such as `80px`.

Android cancellation of a running animation may retain its final transform due to [Reanimated issue 10507](https://github.com/software-mansion/react-native-reanimated/issues/10507). Report any affected app behavior as a known limitation. Do not install an experimental patch or claim the cancellation case passes without executing it.

Expo 57 discovers `postcss.config.js` and `postcss.config.mjs`, not `postcss.config.cjs`. Confirm discovery before preserving an existing config: a successful export may contain unprocessed Tailwind imports. For TypeScript 6, a missing side effect CSS declaration may need `declare module '*.css';` in an included declaration file. This is separate from Nativewind className types.

For React Native Web, retain the working split Tailwind imports. A plain `@import 'tailwindcss';` layers utilities below React Native Web's unlayered defaults; colors, spacing and dark styles can lose despite a successful export. Use:

```css
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
@import 'nativewind/theme';
```

Validate computed custom token colors, spacing and dark styles in a browser after migration. Keep custom `@theme`, plugins and source declarations.
