---
"react-native-css-interop": patch
---

Fix memory leak where each render's declaration guard retained the previous render's state

`getDeclarations` built its guard closure inline, so the closure captured that function's environment — which also holds the `previousState` parameter. Every render therefore linked its own state to the previous one through `declarationTracking.guards`, forming a chain that grew by one link per render and kept every past render alive, along with the element tree held by each state's `props`. Resetting `guards: []` does not help: the array is new, but the closures already created still reference the environment that holds `previousState`.

The guard is now created by a separate factory that only receives the three values it compares, so nothing links a state to its predecessor.
