# V5 engine contract migration notes

Nativewind v5 dark mode follows the [documented Appearance API](https://www.nativewind.dev/v5/core-concepts/dark-mode). The default `dark:` variant compiles to `prefers-color-scheme: dark`. On native, use React Native `Appearance.setColorScheme("light")` or `Appearance.setColorScheme("dark")` for manual selection, and `useColorScheme` from `react-native` to read it. On this Expo target, `Appearance.setColorScheme("unspecified")` restores the system preference. Web uses its CSS media query; native override verification does not establish a browser override mechanism.

Legacy `@cssInterop set darkMode ...` configuration and class-qualified `:root` selectors have no native document root contract. The compiler now reports an explicit error before variable optimization can accidentally apply conditional values unconditionally. Migrate theme behavior to media queries and Appearance. Ordinary ancestor class selectors remain supported as selectors; adding a `dark` ancestor is not required by the documented default v5 theme API.

For preserved CSS variables, use the compiler option `inlineVariables: { exclude: ["--variable-name"] }`. The old `@react-native config { preserve-variables: ... }` directive reports a migration error rather than silently ignoring the option.

The declared deprecated `nativeStyleToProp` option remains supported as an alias for `nativeStyleMapping`. The current option takes precedence when both are provided, including an empty mapping. `target: false` discards unmapped compiled styles while retaining original inline styles.

Unit verification covers compiler semantics, Appearance event subscription, mapping destinations and restoration, and animation metadata delivered to Reanimated. It does not prove native frame interpolation or OS event delivery. The new engine package still requires renderer verification before RC approval.
