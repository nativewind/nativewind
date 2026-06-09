---
"react-native-css-interop": patch
---

Fix dev hot-reload of new utility classes on Metro 0.83+ (Expo SDK 55/56)

The dev-mode haste "change" event now emits the `modifiedFiles` key (which Metro 0.83.6+ / 0.84.3+ reads) with a path relative to `rootDir`, instead of `changedFiles` with an absolute path. This stops the swallowed `modifiedFiles is not iterable` error and ensures the regenerated CSS virtual module is actually matched in Metro's graph and delivered to the connected client — so newly-added utility classes apply via Fast Refresh without a manual Metro restart.
