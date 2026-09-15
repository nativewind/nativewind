---
name: nativewind-preview-to-rc
description: Upgrade an existing Nativewind 5.0.0-preview.4 app using react-native-css 3.0.7 to Nativewind 5.0.0-rc.0, preserving Tailwind 4 setup and checking changed engine contracts. Use the v4 migration skill for Tailwind 3 applications.
---

# Upgrade the v5 preview to RC0

Target the exact published pair `nativewind@5.0.0-rc.0` and `react-native-css@3.1.0-rc.0`. The tested Expo target is 57.0.22, React Native 0.86.3, React 19.2.3, Reanimated 4.5.1 and Worklets 0.10.1. Tailwind CSS and `@tailwindcss/postcss` are 4.1.12; lightningcss is 1.30.1. See [the changed contracts](references/contracts.md) before editing app code. Read [the measured verification scope](references/verification.md) before describing this skill as tested; do not equate structural validation with application verification.

## Inspect and preserve

Run `node <skill-directory>/scripts/preflight.mjs /absolute/path/to/app` before editing and retain its JSON report outside the app. Exit 0 means inventory completed and still requires review; exit 2 identifies a boundary or incompatible pair; exit 1 means the inventory failed. Review every finding and inspect skipped paths, workspace consumers and package manager resolution separately. The helper never validates rendering or declares an app verified. Do not continue through a confirmed NativewindUI v4 boundary.


Record the package manager, manifests, lockfiles, entry points, installed versions, custom Metro/Babel/PostCSS configuration, theme controls and uncommitted edits. Capture a restorable snapshot of every file that may change, including application source, configuration, manifests and lockfiles. Establish available application checks and baseline screens before updating. An app on Tailwind 3 or Nativewind 4 needs the separate v4 workflow. A partially updated RC app needs dependency and configuration reconciliation rather than another wholesale migration.

If Expo differs from the tested target, handle the SDK upgrade as a separate step within the authorized migration. Do not force unrelated native package upgrades merely to make installation succeed. NativewindUI v4 apps retain their supported Nativewind v4 setup without changing the patch version as part of this migration; report this boundary rather than migrating its v4 templates.

## Update the pair

Use the existing package manager and update both packages in one install with exact versions. For npm:

```sh
npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0
```

Keep working Tailwind 4, PostCSS, root CSS imports and `withNativewind` configuration. Preserve custom plugins, resolver settings, source discovery and browser theme behavior. Verify the RC's exact engine peer dependency in the resolved lockfile. A `preview` or `latest` tag is not an exact pin. Do not fix a mismatch by ignoring peer dependencies.

Retain `babel-preset-expo`; the v4 Nativewind Babel preset and Nativewind JSX import source are not part of this setup. Verify the generated native environment declaration belongs to the TypeScript project.

## Review changed contracts

Search for `@cssInterop`, `@react-native`, qualified native root theme selectors, `placeholderClassName`, `indicatorClassName`, `presentationClassName`, `cssInterop` props, and StatusBar `className`. Follow the linked contract guidance only for occurrences present in the application. Do not silence compiler errors or add type casts to preserve an unsupported prop.

The deprecated `vars`, Nativewind color scheme hook, `useUnstableNativeVariable` and `nativeStyleToProp` alias remain available. Do not replace working callers solely because the release changed. Recheck any application workarounds for line height, ripple, corner styles and prop mappings against the actual RC behavior before removing them.

## Verify and repeat

Restart Metro after replacing the engine. Rebuild native applications when native dependencies or configuration change. Run dependency alignment, type checks, production bundles and representative rendering/interaction checks on supported platforms. Compare themes, variable propagation, custom components, navigation and animations with the baseline. Native compilation does not prove native rendering.

Run the migration inventory a second time. An already migrated app should need no new source, dependency or lockfile edits. Preserve unrelated edits throughout. Report exact resolved versions, checks performed, unsupported customizations, incomplete checks, and recovery instructions. Restore only this migration’s changes from the captured source, dependency and configuration files and reinstall to revert; do not discard the user's other work.

## Completion gate

Record a per platform checklist before editing: representative layout and colors, text entry and presses, theme override and system restoration, affected component mappings, navigation and animations where used. Save baseline screenshots and measurable expected values. Run the same checks after migration in the app's actual runtime, rebuilding when native dependencies change. Use a deliberate wrong value in an isolated test copy to confirm the check catches a defect, then restore it. Do not inject a defect into the user's working app.

Treat a build or export as build coverage only. Simulator or emulator evidence is runtime coverage for that tested configuration, not physical device coverage. If a supported platform, affected feature, custom plugin or mapping cannot be exercised, report the migration as implemented with verification pending and list the exact remaining checks. Never report an app ready merely because the preflight, typecheck or bundle passed. If a comparison fails, repair and repeat it or return a concrete rollback path. Repeat the inventory and confirm a second pass makes no new migration edits.
