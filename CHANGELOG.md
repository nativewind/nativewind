# nativewind

## 5.0.0

### Features

- Add support for Next.js 16 with jsx-dev-runtime export (fixes #1670)
  - Added `jsx-dev-runtime` export for Next.js 16 compatibility
  - Supports `jsxImportSource: "nativewind"` in tsconfig.json
  - Compatible with React 19 (jsx is default export)

### Changes

- Verified Tailwind CSS 4 support (peer dependency already set to `>4.1.11`)
- Verified Expo 54 compatibility (already using Expo 54.0.0-preview.6)

### Fixes

- Improved safe area utilities import order in `theme.css` (moved `tailwindcss-safe-area` import to end of file)
  - This may help with Issue #1673, though full fix may require react-native-css support for `env()` CSS functions
- Fixed `setColorScheme('system')` compatibility with React Native 0.82+ (fixes #1665)
  - React Native 0.82 changed 'system' to `null`/`unspecified`
  - Added backward compatibility to handle both 'system' and `null` values
- Added Windows ESM compatibility for metro configuration (fixes #1667)
  - Created `src/metro.ts` wrapper that normalizes file paths on Windows
  - Helps resolve `ERR_UNSUPPORTED_ESM_URL_SCHEME` error on Windows
  - Wraps react-native-css's `withReactNativeCSS` function
- Fixed TypeScript exports to use standard `types` field instead of `typescript` (addresses PR #1612)
  - Changed all exports from `typescript` to `types` for better TypeScript tooling support
  - Follows standard package.json exports specification

### Compatibility Helpers

- Added compatibility helpers in `nativewind/compat` to ease migration from v4 to v5
  - `cssInterop`: Compatibility wrapper for migrating from v4's `cssInterop` to v5's `styled`
  - `mergeStyles`: Helper for Issue #1647 (className and style cannot be used together)
  - Provides similar API to v4 while using v5's underlying `styled` function

### Documentation

- Added migration guide from v4 to v5 (`MIGRATION_GUIDE_V4_TO_V5.md`)
  - Documents Tailwind CSS 4 configuration changes (`@theme` vs `tailwind.config.js`)
  - Documents `cssInterop` to `styled` migration
  - Documents known issues and workarounds
  - Clarifies that Issue #1664 is not a bug but a Tailwind CSS 4 change

### Known Issues

The following issues require fixes in the `react-native-css` package (external dependency):
- Issue #1647: className and style props cannot be used together
- Issue #1673: Safe area utilities (pt-safe, pb-safe, etc.) not working with className
  - Note: Import order improved, but may still require react-native-css support for `env()` CSS functions
- Issue #1675: styled function doesn't work as cssInterop did in v4 (nativeStyleToProp support)
- Issue #1676: Some className produce different results compared to v4
- Issue #1674: Compatibility issue with react-native-skia (non-whitespace character error)

These issues are tracked and will be addressed in future updates to `react-native-css`.

### Migration Notes

- `cssInterop` from v4 has been replaced with `styled` from `react-native-css` in v5
- The API is similar but may require adjustments for `nativeStyleToProp` mappings
- See Issue #1675 for details on migrating from `cssInterop` to `styled`

### Notes

- Some fixes from v4 PRs (#1346, #1525, #1527) are not directly applicable to v5 as the architecture has changed
  - v5 uses `react-native-css` as an external dependency
  - Platform-specific fixes should be implemented in the `react-native-css` package

## 4.1.23

### Patch Changes

- 0bb61b4: Fix incorrect template string in platformPath
- Updated dependencies [0bb61b4]
  - react-native-css-interop@0.1.22

## 4.1.22

### Patch Changes

- 5510db3: Fix building apps locally on windows
- 6fdf899: Fix crash when 'react-native-safe-area-context' is not installed
- 04212e8: Change lightningcss to be a version range
- Updated dependencies [5510db3]
- Updated dependencies [6fdf899]
- Updated dependencies [04212e8]
  - react-native-css-interop@0.1.21

## 4.0.0

### Patch Changes

- fix existing directory error

## 2.0.11

### Patch Changes

- 671897b: fix: useInteraction types
- ca00130: fix: add missing flexBasis from flex-1

## 2.0.10

### Patch Changes

- 1986508: fix: unable to find styles console warning

## 2.0.9

### Patch Changes

- 2b74fa9: fix: stop compiling styles during mode:transformOnly

## 2.0.8

### Patch Changes

- 04a8f5c: fix: never cache user tailwind.config.js

## 2.0.7

### Patch Changes

- a338703: fix: remove addExternalDependency from babel

## 2.0.6

### Patch Changes

- e1b6e6b: fix: filter out null values when rendering styled children #214

## 2.0.5

### Patch Changes

- 6ed9d3a: improve babel cache invalidation
