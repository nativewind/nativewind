---
"react-native-css-interop": patch
---

Stop the web runtime throwing "Cannot manually set color scheme, as dark mode is type 'media'" when the stylesheet is inserted after the runtime loads, as happens in Expo web development when a component that uses Nativewind is imported before `global.css`. The late stylesheet path now only sets the color scheme for `darkMode: "class"`, matching the path that runs when the stylesheet is already present.
