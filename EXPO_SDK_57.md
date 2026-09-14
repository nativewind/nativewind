# Nativewind v4 and Expo SDK 57

This patch updates the Nativewind 4.2.6 source and react-native-css-interop 0.2.6 source for Expo SDK 57. The changeset proposes patch releases of both packages. The locally packed verification archives retain their source versions and are not registry releases or release candidates.

## Consumer configuration

Retain Tailwind CSS 3, `nativewind/preset`, `nativewind/babel`, and `withNativeWind`. Do not replace the v4 configuration with the Nativewind v5 configuration.

The verified SDK 57 consumer locks Expo 57.0.22, React 19.2.3, React Native 0.86.3, Reanimated 4.5.1, Worklets 0.10.1, React Native Web 0.21.2, Tailwind CSS 3.4.4, and TypeScript 6.0.3. Use Expo to resolve its native dependencies and rebuild native applications after upgrading the SDK. Worklets is required by Reanimated 4. The isolated Reanimated 3.10.1 packaging check does not install Worklets.

```js
// babel.config.js
module.exports = {
  presets: [
    ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    "nativewind/babel",
  ],
};
```

```js
// metro.config.js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
module.exports = withNativeWind(getDefaultConfig(__dirname), {
  input: "./global.css",
});
```

Keep the project's Tailwind content paths and import `global.css` once from the application entry. The Expo Router verification consumer also scans its shared workspace component sources. A direct interop consumer supplies an asynchronous `getCSSForPlatform` callback returning authored CSS.

## Runtime changes

An animation added after mount now creates a separate component with stable Reanimated hook order. Upgrading the host can still remount it, as the existing warning documents. To retain the initial host identity, declare `animation: none` or `transition-property: none` initially.

Appearance initialization maps null and unspecified values to a supported light or dark scheme. Box shadow declarations return after compilation instead of falling into aspect ratio parsing. Babel uses `react-native-reanimated/plugin`, which resolves through Worklets on Reanimated 4 and works without Worklets on Reanimated 3.

The React 19 test updates replace the obsolete function component ref warning expectation with a working ref assertion, remove a vacuous Promise assertion, and measure transition values at their actual timing boundaries. They do not suppress failing renderer assertions.

## Verification

The companion compatibility checkout is `../compatibility` in the implementation workspace. Its `release/v4-expo57.json` pins package archives, consumer lockfiles, source revision, native binaries, expected regressions, and exact Android renderer limitations.

```sh
npm run coverage:v4:source
npm run verify:v4:expo57 -- --manifest release/v4-expo57.json --mode fast
npm run verify:v4:expo57 -- --manifest release/v4-expo57.json --mode replay
npm run verify:v4:expo57 -- --manifest release/v4-expo57.json --mode full
```

Run these commands in the compatibility checkout. Fast mode checks source tests, installed archive bytes, Babel contracts, consumer types, dependencies, and paired regressions. Replay validates saved evidence hashes and reruns the static geometry and pixel assertions. SDK 54 native records also replay serialized deliberate defect measurements; older records preserve the original rejection, frozen runner and defect screenshot. Full mode additionally collects clean consumer installations, exports, native builds, and platform runs; it requires configured native tools and devices.

Source coverage passes all 950 tests across 63 suites. It includes unloaded source files in both packages, excluding tests, declarations and test helpers: lines 58.35%, statements 58.11%, functions 60.08%, and branches 53.00%. Production browser and native runs are separate evidence and do not contribute to these percentages.

The SDK 54 comparison now includes iOS and Android Release applications using the same static catalog as SDK 57. A separate bare Android Release consumer with React Native 0.75.2, React 18.3.1 and Reanimated 3.15.5 passes five animation controls and two interruption/cleanup probes without Worklets. This does not establish Reanimated 3 on SDK 57, Reanimated 3.10.1 native support, or legacy iOS coverage.

The extended iOS sweep passes 247 of 269 applicable cases, with 17 failures and five insensitive controls. All 22 nonpassing cases also remain nonpassing on published 4.2.6. Shadow transitions now compile, but their renderer assertion still fails. The companion feature findings preserve those results separately from the static matrix.

The generated report separates compatibility within the executed matrix from release readiness. Eight Android text decoration case IDs remain inconclusive in both SDK cohorts because their plain renderer controls do not detect deliberate defects. Physical devices, legacy iOS, and the full extended feature catalog on Android and web remain unverified. Native development evidence uses Expo Go. These results do not establish blanket release readiness.

No registry publication is performed by the verification command. Apply the changeset and verify the resulting exact package pair before publishing stable patches. Release interop before the Nativewind package that depends on it. There is no prerelease step.
