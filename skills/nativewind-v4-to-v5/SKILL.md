---
name: nativewind-v4-to-v5
description: Migrate an existing Nativewind v4 application to the pinned Nativewind v5 release, preserving custom configuration and verifying the application's native and web behavior.
---

# Migrate Nativewind v4 to v5

This draft targets Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0 on Expo 57.0.22. It is staged for evaluation after RC publication. It has not yet passed the independent application migration acceptance matrix and must not be advertised as a verified migration tool. Read [the target and verification contract](references/target.md) before changing dependencies. Verify that both exact versions are available; do not substitute a preview, latest tag or newer RC.

## Inspect before changing

Record the package manager, package and lockfile versions, Expo SDK, React Native, Tailwind, Reanimated and Worklets. Locate Router roots, workspaces, browser entry points, CSS imports, Babel, Metro, PostCSS and TypeScript configuration. Preserve unrelated edits and capture the original configuration and lockfile for recovery.

Search application code for `cssInterop`, `remapProps`, `vars`, `useColorScheme`, `useUnstableNativeVariable`, third party component mappings and imports from `react-native-css-interop`. Inventory custom theme values, plugins and utilities. A partially migrated app needs diagnosis before another conversion pass. Do not remove a dependency still used by another workspace package.

If the Expo version differs from the target, explain the required Expo upgrade and verify it as a separate step within the user's requested scope. Keep native dependencies aligned with Expo. Do not force incompatible React Native, Reanimated or Worklets versions to satisfy a styling migration.

## Apply applicable conversions

Use the project's existing package manager and install the exact package pair in the target contract. Translate Tailwind 3 theme values into Tailwind 4 CSS configuration. Preserve custom values and plugins; when no verified equivalent exists, retain their source and report the manual decision with file locations.

Use `@tailwindcss/postcss` for PostCSS. Import `tailwindcss` and `nativewind/theme` in the root CSS and import that CSS once from the application root. For workspace classes, add the relevant Tailwind `@source` paths. Use `withNativewind` from `nativewind/metro` around Expo's default Metro config while preserving unrelated Metro customizations. Remove the v4 Nativewind Babel preset and Nativewind JSX import source option, preserving `babel-preset-expo` and unrelated plugins. Validate generated environment declarations are included in the TypeScript project; remove obsolete v4 declarations only after all remaining callers are addressed.

Use the v5 public `styled` mapping contract for supported custom components. Do not mechanically rename `cssInterop` or `remapProps`: identity, nesting, prop destinations and precedence can differ. Check the target package's declarations and a representative runtime example for each mapping. Explicit meaningful component props can override generated props. Nested Text inheritance and CSS variables have separate contracts.

Prefer `VariableContextProvider` for variable propagation. Preserve runtime variables by configuring `inlineVariables.exclude` where required. Use units for length variables shared with browsers. Do not treat deprecated `vars` or `useUnstableNativeVariable` as removed APIs; assess their callers and migrate only to verified equivalents.

For the default native dark variants, read `useColorScheme` from `react-native`. Use `Appearance.setColorScheme('dark')` or `'light'` for an override, and `'unspecified'` to restore system appearance on this target. Configure Expo `userInterfaceStyle: 'automatic'` when the app follows system appearance. Preserve intentionally custom browser theme behavior; native Appearance does not replace a browser class selector.

Read [the utility migration candidates](references/utility-migrations.json) only when corresponding utilities occur. These are Tailwind migration intentions with compiled CSS evidence, not proofs of native equivalence. Check the linked compatibility notes for input domains, adapter requirements and explicit platform limitations. Do not globally replace every matching class without validating its use.

## Verify and report

Run dependency consistency and available type, build and application checks. Rebuild native apps when native dependencies change and restart Metro after engine or configuration changes. Exercise the actual native and browser surfaces the application supports. Include rendering, interactions, theme override and system restoration, navigation or remounts, and affected component mappings. Compilation alone does not prove visual parity. Compare representative states with the original app or independent native styles, and use a deliberately wrong value to establish that the observation detects a defect.

Report changed files, converted contracts, passed checks, failed or unavailable checks and manual decisions. Repeat the migration inventory after changes; a second invocation must not duplicate imports, wrappers, configuration or dependencies. Preserve unrelated edits. For recovery, restore the captured dependency and configuration files, reinstall using the same package manager, and rebuild native apps if needed. Do not discard the user's application changes.
