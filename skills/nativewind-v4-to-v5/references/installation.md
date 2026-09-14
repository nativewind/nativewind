# RC0 installation contract

The published pair is Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0. The tested Expo target is 57.0.22, React Native 0.86.3, React 19.2.3, Reanimated 4.5.1 and Worklets 0.10.1. Keep Expo alignment separate from styling migration. Verify exact resolved native versions after installation.

Use the application's existing package manager. Update the related entries in `package.json` together before installing, preserving unrelated dependencies and dependency groups:

```json
{
  "dependencies": {
    "nativewind": "5.0.0-rc.0",
    "react-native-css": "3.1.0-rc.0"
  },
  "devDependencies": {
    "tailwindcss": "4.1.12",
    "@tailwindcss/postcss": "4.1.12",
    "postcss": "8.5.6"
  }
}
```

This is a fragment to merge, not a replacement manifest. Move an existing Tailwind entry rather than duplicating it across dependency groups. Remove a direct v4 engine dependency only after checking all callers and workspace consumers. Then run the package manager's normal install, such as `npm install`, retaining the existing lockfile. Installing the RC first while the manifest still requires Tailwind 3 can produce `ERESOLVE`.

If installation fails, inspect the actual peer conflict. Preserve the original manifest and lockfile; do not reflexively delete the lockfile or use `--force`/`--legacy-peer-deps`. In the evaluated npm 10.9.4 v4 lockfile, even a compatible atomic manifest update can leave npm trying to resolve the old Nativewind 4/Tailwind 3 peer graph. Removing only node_modules does not fix that case.

For that confirmed stale styling graph, the tested lockfile preserving recovery is:

1. Save the intended RC manifest to a temporary file outside the app; keep the original rollback copy separately.
2. Run `npm uninstall nativewind react-native-css tailwindcss @tailwindcss/postcss postcss` to let npm remove the old styling graph from its lockfile. In a workspace, scope this operation to the app and preserve dependencies still needed by other consumers.
3. Restore the saved intended RC manifest exactly, then run `npm install`.
4. Verify exact installed versions and compare the new lockfile with the original, reporting unrelated dependency changes. Remove the temporary target copy after success.

The temporary uninstall state is not a runnable migrated app. If any step fails, restore the captured manifest and lockfile, reinstall the original app, and report the conflict. Do not prune other workspaces or manually rewrite lockfile dependency graphs. This recovery was exercised in the single app npm fixture; other managers and workspace layouts require their normal equivalent, not a blind npm command.

Pin the resolved lightningcss dependency to 1.30.1 with the package manager's supported overrides or resolutions, preserving unrelated entries. Keep Expo aligned `react-native-reanimated`, `react-native-worklets`, `react-native-safe-area-context` and `expo-system-ui`. Do not use peer dependency bypass flags as a migration fix.

Merge the following into the project's existing configuration, preserving custom plugins and resolver settings.

Use `postcss.config.js` for a CommonJS project, or `postcss.config.mjs` with an ESM export. Expo 57 does not discover `postcss.config.cjs`. An export can succeed with unprocessed CSS, so verify an actual styled element.

```js
module.exports = { plugins: { '@tailwindcss/postcss': {} } };
```

Use the v5 Metro wrapper:

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');
const config = getDefaultConfig(__dirname);
module.exports = withNativewind(config);
```

Replace v4 Tailwind directives in the root CSS, preserving and migrating project theme values, plugins and additional sources:

```css
@import 'tailwindcss/theme.css' layer(theme);
@import 'tailwindcss/preflight.css' layer(base);
@import 'tailwindcss/utilities.css';
@import 'nativewind/theme';
```

Keep Tailwind utilities unlayered in React Native Web applications. A plain `@import 'tailwindcss';` places utilities in a layer that can lose to React Native Web defaults even though the production export succeeds. Preserve the split import order above.

Import the root CSS once from the app entry or Router root layout. Keep `babel-preset-expo`; remove only the v4 Nativewind Babel preset and Nativewind JSX import source setting. Set Expo `userInterfaceStyle` to `automatic` if the app follows system appearance. Ensure generated environment types belong to the TypeScript project. TypeScript 6 may also need `declare module '*.css';` for a side effect stylesheet import; this declaration does not replace Nativewind's className types.

Restart Metro after the engine or configuration changes. Rebuild native apps if native dependencies or app configuration changed. Check CSS discovery, a custom token, layout, interactions, themes and mappings in addition to type checks and production exports.

Read the [compatibility notes](compatibility.md) for contract limitations and the [published RC release](https://github.com/nativewind/nativewind/releases/tag/5.0.0-rc.0) for release details. Migration evaluation is separate from the library's release audit; neither guarantees parity for an arbitrary application.
