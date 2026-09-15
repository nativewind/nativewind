---
name: debug-nw
description: Debug a Nativewind v5 RC setup issue by checking actual dependencies, Metro, Babel, PostCSS, CSS and runtime behavior.
allowed-tools: Read, Grep, Glob, Bash
---

Read `DEVELOPMENT.md`, `docs/expo57-rc.md` and the relevant sections of `docs/rc-compatibility.md`. Inspect the application's files and resolved dependencies before proposing changes. If the installed package is v4, use the v4 documentation; do not apply v5 configuration to it.

## 1. Check the version pair

The current target is `nativewind@5.0.0-rc.0` with exactly `react-native-css@3.1.0-rc.0`. Check the manifest, lockfile and installed versions. Do not substitute `@latest`, `@preview` or the old `^3.0.1` engine range. The repository manifest can retain a preview version between releases; use the published release contract for consumer setup.

The tested target is Expo 57.0.22, React Native 0.86.3, React 19.2.3, Reanimated 4.5.1 and Worklets 0.10.1. The tested CSS toolchain uses Tailwind CSS and `@tailwindcss/postcss` 4.1.12 with Lightning CSS 1.30.1. Engine peer minimums are not evidence of runtime verification on every older SDK. Treat an Expo upgrade as a separate step and preserve the app's package manager and unrelated configuration.

## 2. Check PostCSS and the CSS entry

Expo 57 discovers `postcss.config.js` and `postcss.config.mjs`, but not `postcss.config.cjs`. Use `@tailwindcss/postcss`, not the Tailwind v3 PostCSS plugin:

```js
export default { plugins: { "@tailwindcss/postcss": {} } };
```

Import the CSS once from `App.tsx` or the Router root layout. Keep utilities unlayered so React Native Web defaults do not override them:

```css
@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "tailwindcss/utilities.css";
@import "nativewind/theme";
```

Check the existing package manager overrides or resolutions for Lightning CSS 1.30.1. Preserve custom theme values, plugins, source discovery and workspace paths.

## 3. Check Metro and Babel

Wrap the existing Metro configuration with `withNativewind` from `nativewind/metro`. Preserve custom resolvers and transformers. The deprecated `withNativeWind` alias still exists; its spelling alone does not explain a failure.

Keep `babel-preset-expo` and unrelated plugins. Remove the v4 Nativewind Babel preset and `jsxImportSource` settings when migrating from v4. The v5 Metro integration enables the engine's import rewriting; do not add the old v4 preset to fix it.

## 4. Check TypeScript and component contracts

Ensure the generated `nativewind-env.d.ts` references `react-native-css/types` and belongs to the TypeScript project. A type error about `className` can indicate missing declarations or an unsupported component, not necessarily a Babel problem. If the TypeScript project checks CSS side effect imports, include `declare module "*.css";` in an application declaration file.

Read the actual exports in `src/index.tsx`. V5 does not export v4 `cssInterop`, `remapProps` or `verifyInstallation`. `styled` returns a component that callers must render; it does not globally register the original component. Use the RC mapping contract, including `nativeStyleMapping` and the supported `nativeStyleToProp` alias. Do not invent a `global` option or suppress unsupported props with casts.

For dynamic variables, check `VariableContextProvider`'s `value` prop and `inlineVariables.exclude` before assuming a compiler defect. For native themes, check `expo-system-ui`, `userInterfaceStyle: "automatic"` and React Native `Appearance`; on the tested target, `"unspecified"` restores the system preference.

## 5. Verify the symptom

Restart Metro after changing the engine. Rebuild when native dependencies or native configuration change. Compare the failing case with direct React Native styles or Reanimated controls where relevant. Consult the RC compatibility notes for rejected CSS values and the accepted Android animation cancellation limitation.

Record exact versions, platform, build mode and the observed result. A passing typecheck, bundle or mocked host test does not establish rendering or interaction correctness. Exercise the affected layout, input, themes, mappings, navigation or animations in the app's supported runtimes. Report unavailable platform checks as pending.

For a migration, use the appropriate repository skill in `skills/nativewind-v4-to-v5` or `skills/nativewind-preview-to-rc`, including its preflight and completion gate. Preserve the supported v4 setup of NativewindUI v4 apps.
