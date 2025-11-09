# nativewind

## 5.0.0

### Features

- Add support for Next.js 16 with jsx-dev-runtime export (fixes #1670)
  - Added `jsx-dev-runtime` export for Next.js 16 compatibility
  - Supports `jsxImportSource: "nativewind"` in tsconfig.json

### Changes

- Verified Tailwind CSS 4 support (peer dependency already set to `>4.1.11`)
- Verified Expo 54 compatibility (already using Expo 54.0.0-preview.6)

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
