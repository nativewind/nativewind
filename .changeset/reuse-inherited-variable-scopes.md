---
"react-native-css-interop": patch
---

Reuse inherited variable scopes when a native component has no local variables, avoiding a copy of every inherited variable on mount. Preserve local variable overrides and root Map conversion.
