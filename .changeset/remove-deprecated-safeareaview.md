---
"react-native-css-interop": patch
---

Remove cssInterop registration for deprecated SafeAreaView from react-native. The import triggered a deprecation warning for all users, even those not using SafeAreaView. The SafeAreaView from react-native-safe-area-context remains supported.
