# react-native-css-interop

## 0.2.3

### Patch Changes

- af3cdd0: Remove cssInterop registration for deprecated SafeAreaView from react-native. The import triggered a deprecation warning for all users, even those not using SafeAreaView. The SafeAreaView from react-native-safe-area-context remains supported.

## 0.2.2

### Patch Changes

- b1c1378: fix: preserve ref in react19

## 0.2.0

### Minor Changes

- fb4503d: Fixes for RN 0.81 and reanimated 4

## 0.1.22

### Patch Changes

- 0bb61b4: Fix incorrect template string in platformPath

## 0.1.21

### Patch Changes

- 5510db3: Fix building apps locally on windows
- 6fdf899: Fix crash when 'react-native-safe-area-context' is not installed
- 04212e8: Change lightningcss to be a version range
