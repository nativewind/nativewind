---
"react-native-css-interop": patch
---

Stop the dev-only upgrade warning from crashing the app. When a component gains a CSS variable, animation or container after its first render, the warning prints the component's props, and that walk followed React elements into the component tree and invoked getters that throw by design, such as React Navigation's default context value ("Couldn't find a navigation context"). Elements are now printed by name, getters that throw are marked as unreadable, and the warning always logs instead of throwing.
