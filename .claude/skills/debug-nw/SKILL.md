---
name: debug-nw
description: Debug a Nativewind v5 setup issue. Walks through common configuration problems with metro, babel, postcss, and dependencies.
allowed-tools: Read, Grep, Glob, Bash
---

You are helping debug a Nativewind v5 configuration issue. Walk through these checks systematically.

## 1. Version check

- Is `nativewind` at v5.x? (`package.json`)
- Is `react-native-css` installed as a peer dependency? Must be `^3.0.1`
- Is `tailwindcss` v4+? Must be `>4.1.11`
- Is `@tailwindcss/postcss` installed?

## 2. PostCSS config

Nativewind v5 uses Tailwind CSS v4's PostCSS plugin. Check for `postcss.config.mjs`:

```javascript
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

**Common mistake**: Using Tailwind v3's `tailwindcss` PostCSS plugin instead of `@tailwindcss/postcss`.

## 3. CSS entry file

Check that the global CSS file imports the nativewind theme:

```css
@import "tailwindcss";
@import "nativewind/theme";
```

**Common mistake**: Missing `@import "nativewind/theme"` — this provides RN-specific utilities.

## 4. Metro config

Check `metro.config.js` for `withNativewind()`:

```javascript
const { withNativewind } = require("nativewind/metro");
module.exports = withNativewind(config);
```

**Common mistake**: Using `withNativeWind` (capital W) — deprecated.

## 5. Babel config

Check that the babel plugin is configured. The react-native-css babel plugin should be active (this is handled by `withNativewind` in metro config, but verify).

## 6. TypeScript

Check for `nativewind-env.d.ts` in project root — should be auto-generated. If missing, the `withNativewind` metro config may not be running.

## 7. Common symptoms

- **"className is not a valid prop"**: Babel plugin not active — check metro config
- **Styles not applying**: CSS file not imported, or PostCSS not processing
- **Build errors with Tailwind**: Wrong Tailwind version (needs v4+)
- **Runtime errors about react-native-css**: Missing peer dependency

## Approach

Ask the user what symptom they're seeing, then check the relevant configs. Read their actual files to diagnose rather than guessing.
