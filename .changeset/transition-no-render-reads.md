---
"react-native-css-interop": patch
---

Stop `transition-*` classes from reading and writing a shared value while React renders

`processTransition` compared the new value with `sharedValue.value` and assigned the animation to it from the `useReducer` reducer, which runs during render. Reanimated 4 warns about both ("Reading from `value` during component render" on every re-render, "Writing to `value`" when a transition starts). The last target is now kept on the reducer state and the animation is started from an effect after the commit.
