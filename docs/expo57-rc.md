# Nativewind v5 Expo 57 release candidate

Publication draft. These versions are prepared locally and are not available on npm yet. Do not announce the installation commands until registry verification and public tag promotion succeed.

Proposed pair: Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0. Nativewind's peer dependency selects that exact engine candidate. The target is Expo 57.0.22, React Native 0.86.3, React 19.2.3, Reanimated 4.5.1, and Worklets 0.10.1.

## Installation after publication

In an Expo 57 project:

```sh
npm install --save-exact nativewind@5.0.0-rc.0 react-native-css@3.1.0-rc.0 tailwindcss@4.1.12 @tailwindcss/postcss@4.1.12 lightningcss@1.30.1
npx expo install react-native-reanimated react-native-worklets react-native-safe-area-context expo-system-ui
```

Keep the native dependency versions selected by the supported Expo SDK. Restart Metro after installing or upgrading the engine. Rebuild the native app when native dependencies change.

Use postcss.config.js:

```js
module.exports = { plugins: { '@tailwindcss/postcss': {} } };
```

Use metro.config.cjs:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');
module.exports = withNativewind(getDefaultConfig(__dirname));
```

Use global.css and import it once in the root layout:

```css
@import "tailwindcss";
@import "nativewind/theme";
```

Keep babel-preset-expo in Babel configuration. Enable userInterfaceStyle automatic in app.json for system appearance changes. TypeScript setup generates the Nativewind environment declaration and ensures it belongs to the TypeScript project.

## Migration from v4

Upgrade Tailwind 3 configuration to Tailwind 4 CSS configuration. Replace the v4 Metro integration with withNativewind above. Remove the v4 Nativewind Babel preset and JSX import source setting; keep the Expo preset. Use react-native-css adapters for third party components and validate prop mappings against the new mapping contract. The old react-native-css-interop engine is not the v5 engine.

For default dark variants, use system appearance media queries. Read useColorScheme from react-native. Set Appearance.setColorScheme('dark') or 'light' for a native override and 'unspecified' to restore the system preference on this Expo target. Legacy @cssInterop and @react-native configuration directives report migration errors. Use compiler inlineVariables.exclude for variables that must remain available at runtime. Prefer VariableContextProvider over the deprecated vars helper. Express cross platform length variables with units, such as '80.5px'.

Keep a copy of your previous package.json, lockfile, and configuration before migration. To revert, restore those files, reinstall the previous dependencies, and rebuild native apps if their native dependencies changed.

## Changes and limitations

The candidate contains Expo alignment, production prop mapping fixes, layout and style regression fixes, Node ESM tooling entries, TypeScript declaration membership fixes, and compiler cache invalidation. Detailed evidence distinguishes compiler, runtime, integration, and device verification.

Android animation cancellation remains affected by [Reanimated issue 10507](https://github.com/software-mansion/react-native-reanimated/issues/10507). Changing a running rotation to animationName none or removing the animation styles can leave its final transform in place. Direct Reanimated controls reproduce the issue without either library. The behavior is intermittent: an isolated none check passed while the complete integrated audit reproduced the failure. The exact Android animate-none reset case is retained as an accepted upstream defect and is excluded from passing support claims. The iPhone case, browser cancellation checks and all other motion cases remain required. No experimental dependency patch is included. Physical Android testing is excluded; Android verification uses an emulator.

The complete inventory review accounts for 6,129 entries with no unresolved dispositions. The final matrix requires 4,985 executions across compiler, runtime, tooling, rendering and interaction layers. All 4,985 required executions passed the final integrity checked release gate, with zero missing assertions. These counts describe the reviewed scope and do not claim that every CSS value works on every platform. The audit is complete. Public source review and a subsequent publication instruction remain necessary before npm release.

The [compatibility guide](rc-compatibility.md) records supported value domains, migrations, safe rejections and platform limits. Browser image fitting in the historical React Native Web and Expo Image adapters requires explicit resizeMode or contentFit/contentPosition props. The original WebKit backface scene and Firefox select-all interaction remain unverified. The generated select-none utility requires an explicit WebkitUserSelect:none style in the pinned WebKit engine. Native and other browser examples remain independently tested.

The pinned browsers ignore break-before:all and break-after:all. Firefox also ignores avoid-page and column for these properties. The audit records the unsupported declaration and its fallback against a supported control; it makes no pagination claim. Native animation samples begin after the mount callback, retaining earlier layout checkpoints separately. Initial samples within 100 milliseconds and intermediate and final trajectories remain required.

Report reproducible issues to [Nativewind](https://github.com/nativewind/nativewind/issues) or [react-native-css](https://github.com/nativewind/react-native-css/issues). Include exact package versions, Expo SDK, platform and OS version, development or Release mode, configuration, expected and actual behavior, and a minimal reproduction. Include whether direct React Native or Reanimated reproduces the problem.

Stable promotion remains blocked on the full audit, required migration evaluation, and the v4 to v5 migration skill. Stable npm tags will not change during this RC publication.

The public migration skill draft is staged at `skills/nativewind-v4-to-v5/SKILL.md` in the Nativewind repository. It includes the pinned target and its supporting references. Structural validation passes. Independent migration evaluation and registry installation checks remain required before the skill is advertised as verified and before stable promotion.
