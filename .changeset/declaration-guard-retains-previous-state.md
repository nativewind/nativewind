---
"react-native-css-interop": patch
---

Fix the declaration guard retaining more state than it compares

`getDeclarations` built its guard closure inline, so the closure captured that function's environment rather than the three values it actually compares. Under Hermes `-Og` (dev builds) that environment holds every local and parameter, `previousState` included, so each render linked its state to the previous one through `declarationTracking.guards` — a chain that grew by one link per render and kept every past render alive, along with the element tree held by each state's `props`. Resetting `guards: []` does not help: the array is new, but the closures already created still reference the environment. Under `-O` (release builds) the environment narrows to `config` and `state`, which removes the generational chain but still pins that render's state.

The guard is now built by a factory that only receives `config`, `className` and `inline`, so nothing beyond those is captured.
