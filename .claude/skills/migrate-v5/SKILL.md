---
name: migrate-v5
description: Guide migration from Nativewind v4 (Tailwind v3) to Nativewind v5 (Tailwind v4). Analyzes current setup and provides step-by-step migration.
allowed-tools: Read, Grep, Glob, Bash
---

You are helping a user migrate from Nativewind v4 to v5. This is a major migration because the underlying architecture changed significantly.

## Key changes v4 → v5

| Area | v4 | v5 |
|------|----|----|
| Tailwind | v3 (`tailwind.config.js`) | v4 (`@tailwindcss/postcss`, CSS-based config) |
| Core engine | `react-native-css-interop` (bundled) | `react-native-css` (peer dep, separate install) |
| Package structure | Monorepo | Single package |
| Babel config | `jsxImportSource: "nativewind"` | Handled by react-native-css babel plugin |
| Metro config | `withNativeWind(config, { input })` | `withNativewind(config)` (lowercase w, no input) |
| CSS entry | `@tailwind base/components/utilities` | `@import "tailwindcss"; @import "nativewind/theme"` |
| Tailwind config | `tailwind.config.js` with `nativewind/preset` | CSS-based via `@theme` in CSS files |

## Migration steps

1. **Update dependencies**:
   - Remove: `tailwindcss` v3
   - Install: `nativewind@5`, `react-native-css@^3.0.1`, `tailwindcss@^4.1`, `@tailwindcss/postcss`

2. **Replace tailwind.config.js** with CSS-based configuration:
   - Content paths → automatic in Tailwind v4
   - Theme customization → `@theme { }` blocks in CSS
   - Plugins → `@plugin` directives in CSS

3. **Update PostCSS config**: Add `@tailwindcss/postcss` plugin

4. **Update CSS entry file**: Replace `@tailwind` directives with `@import`

5. **Update Metro config**: Change to new `withNativewind()` API

6. **Update Babel config**: Remove `jsxImportSource: "nativewind"`

7. **Check for API changes**: `useColorScheme` from nativewind is deprecated — use `useColorScheme` from `react-native` instead

## Approach

1. Read the user's current config files (`package.json`, `tailwind.config.js`, `metro.config.js`, `babel.config.js`, global CSS file)
2. Identify what needs to change
3. Provide specific diffs for each file
4. Note any custom Tailwind config that needs CSS-based equivalents in v5
