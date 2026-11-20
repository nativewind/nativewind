---
"react-native-css-interop": patch
---

Subscribe an effect to an observable only once. Repeated reads with the same effect no longer add a new cleanup closure to `effect.dependencies` on every read.
