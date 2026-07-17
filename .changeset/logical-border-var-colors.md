---
"react-native-css-interop": patch
---

Fix `border-s-*` and `border-e-*` colors defined with CSS variables

Colors containing `var()` (e.g. shadcn-style `hsl(var(--primary))` theme colors) take the unparsed declaration path, whose property mapping was missing the `border-inline-*` entries the parsed path already had. The property leaked through as `borderInlineStartColor`/`borderInlineEndColor`, which React Native silently drops. These now map to `border-left/right-color` and `border-left/right-width`, matching the behavior of literal colors.
