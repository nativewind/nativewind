# Mechanical evaluation scope

Evaluated on 2026-09-14 using Nativewind 5.0.0-preview.4/react-native-css3.0.7 as the last preview pair and Nativewind 5.0.0-rc.0/react-native-css3.1.0-rc.0 as the exact destination. Both controlled npm apps use Expo 57.0.22 with its aligned native dependencies.

A separate agent used this skill on a working preview and an interrupted manifest update containing Nativewind RC with the old engine. The interrupted input has no claimed working baseline. The regular preview's working baseline was established after explicit fixture repairs: included CSS declarations, discovered PostCSS filename and the correct split Tailwind imports. Those repairs are distinguished from the RC dependency migration.

Both final apps pass TypeScript and production web/iOS/Android JavaScript exports. Independent Chromium checks pass custom token color/spacing, variable width, button and typing behavior, dark mode and restoration, with baseline parity for the regular preview. The RC native compiler/runtime suite passes 18 checks using Expo Jest host mocks. Wrong-width negative controls fail and restored values pass.

All15 regular and16 interrupted source/config/manifest/lock/note hashes remain unchanged after repeat installs and the final skill inventory. Custom Babel/Metro setup, all Scene.tsx bytes, deprecated vars usage and unrelated business edits are preserved. The regular preview rollback drill restores captured baseline files, npm ci, exact preview pair, TypeScript and web export, then restores the RC.

Limits: these apps do not exercise preview upgrade navigation, native animation timing, every removed prop mapping, qualified root theme selectors, older Expo upgrades or other package managers. Native output is tested through Jest platform hosts, not a device or simulator. The v4 mappings tests are not evidence that every preview mapping upgrade works. These are fixture-scoped results, not a promise of automatic parity in every app.

## Additional mobile and preflight checks

Actual iOS 26.5 simulator checks now cover the v4 mappings baseline and migrated output in an identical native host. Recorded layout rectangles match; static screenshot mean RGB difference is 0.365/255. Native typing, presses, appearance override/system restoration, prop mapping pixels and intermediate pulse animation frames were observed. A deliberate width defect is detected and repaired. Migrated preview and workspace Scene sources also render in that harness, with colors and theme checks, but their full project bootstraps were not executed. The reused Release host has matching RN/Reanimated/Worklets provenance; this is not a fresh iOS build. Full Router navigation, physical devices and arbitrary app behavior remain unverified. These observations extend the mocked host checks above and do not replace their stated scope.

The read only preflight passes 18 fixture runs and invalid path handling on Node 22. App hashes remain unchanged. Its version and source inventory is heuristic, not semver resolution, exhaustive source analysis or runtime verification. Even a clean inventory always reports verified false and runtime verification pending.

Android followup: a freshly compiled debug host with bundled production JavaScript renders the v4 mappings fixture on a Pixel 7 Pro API 34 emulator. Native panel width80, padding height36 and Gauge32×32 are observed. Android interactions, themes, negative control, original baseline and preview runtime remain unverified because automation stalled. This is partial Android rendering coverage only.
