---
"react-native-css-interop": patch
---

Prevent exponential recursion and OOM crash in `printUpgradeWarning`.

Previously, `printUpgradeWarning` attempted to recursively serialize `originalProps` with `seen.delete(value)` and manual recursive `replace()`. In complex React Native component trees containing circular refs, React elements, and navigation contexts, this resulted in exponential duplication, leaking 42+ MB/s of heap memory and freezing the JS thread (triggering Hermes `GCBase::oom`).

This change sanitizes `originalProps` to a safe shallow 1-depth representation, masking `children`, functions, and nested objects, eliminating deep recursion while still providing useful props context in the warning.
