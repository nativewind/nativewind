---
"react-native-css-interop": patch
---

Fix the dev-only upgrade warning crashing or hanging apps: `printUpgradeWarning`'s
props serializer invoked throwing property getters (e.g. React Navigation's default
context value, surfacing as "Couldn't find a navigation context" render errors) and
re-walked shared subtrees exponentially. The walk is now bounded, exception-safe, and
skips repeat visits, so the warning always prints instead of crashing the render.
