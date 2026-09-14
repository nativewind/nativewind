# Mechanical evaluation scope

Evaluated on 2026-09-14 against the published Nativewind 5.0.0-rc.0 and react-native-css 3.1.0-rc.0 pair. These results describe controlled fixtures, not a guarantee for arbitrary applications.

Four npm applications started on Nativewind 4.2.6 and Tailwind 3.4.19 with Expo 57.0.22 already aligned: a minimal app, a Router app with custom theme/plugin, a workspace with a shared component, and an app with prop mappings, variables, placeholder color, SVG, image and animation declarations. Independent agents applied the skill. Browser and native runtime oracles were maintained separately from the migrating agents.

All four final apps pass TypeScript, web production export and iOS/Android JavaScript bundle export. Chromium measurements compare original and migrated colors, spacing, variable dimensions, custom utility/workspace styles, button and typing behavior, and system dark/light changes. The independent RC native compiler/runtime suite passes 46 checks across these four apps using Expo Jest host mocks. Each fixture rejects an intentionally wrong width and passes the restored value.

Second inventories preserve17/17/19/17 source/config/lock hashes. A rollback drill restores the baseline manifest/lock/source, runs npm ci, TypeScript and web export, then restores the exact migrated hashes. A NativewindUI boundary check makes no edits and retains4.2.6.

A fresh fifth application run exercises the corrected instructions and npm lockfile preserving recovery. Its browser output matches the original minimal baseline. The original lockfile is updated through ordinary npm uninstall/install, never deleted or manually rewritten. Shared dependency drift is disclosed in the complete evaluation report.

Observed defects corrected during evaluation: stale publication text; npm's old styling peer graph; Expo ignoring postcss.config.cjs; and full Tailwind imports whose layered utilities lose to React Native Web defaults. Fixture side effect CSS declarations were repaired before accepting their baseline as working.

Limits: npm 10.9.4/Node 22.22.0 and already aligned Expo 57 fixtures only. Other managers, older Expo SDK upgrades, complex multi-app dependency hoisting, untested third party wrappers, native devices, animation timing/cancellation, SVG/image pixels and full native navigation need app-specific verification. Native assertions evaluate RC output against fixed intended values with mocked platform hosts; they are not a historical v4 native device comparison. Repeat-run results do not prove identical decisions across all agents/models.

## Additional mobile and preflight checks

Actual iOS 26.5 simulator checks now cover the v4 mappings baseline and migrated output in an identical native host. Recorded layout rectangles match; static screenshot mean RGB difference is 0.365/255. Native typing, presses, appearance override/system restoration, prop mapping pixels and intermediate pulse animation frames were observed. A deliberate width defect is detected and repaired. Migrated preview and workspace Scene sources also render in that harness, with colors and theme checks, but their full project bootstraps were not executed. The reused Release host has matching RN/Reanimated/Worklets provenance; this is not a fresh iOS build. Full Router navigation, physical devices and arbitrary app behavior remain unverified. These observations extend the mocked host checks above and do not replace their stated scope.

The read only preflight passes 18 fixture runs and invalid path handling on Node 22. App hashes remain unchanged. Its version and source inventory is heuristic, not semver resolution, exhaustive source analysis or runtime verification. Even a clean inventory always reports verified false and runtime verification pending.

Android followup: a freshly compiled debug host with bundled production JavaScript renders the v4 mappings fixture on a Pixel 7 Pro API 34 emulator. Native panel width80, padding height36 and Gauge32×32 are observed. Android interactions, themes, negative control, original baseline and preview runtime remain unverified because automation stalled. This is partial Android rendering coverage only.
