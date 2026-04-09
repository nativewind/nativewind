---
name: debug-nw
description: Debug a Nativewind v4 setup issue. Walks through common configuration problems with metro, babel, tailwind config, and dependencies.
allowed-tools: Read, Grep, Glob, Bash
---

You are helping debug a Nativewind v4 configuration issue. Walk through these checks systematically.

## 1. Version check

- Is `nativewind` at v4.x? (`package.json`)
- Is `tailwindcss` v3.x? Nativewind v4 requires Tailwind v3 and will reject v4+.
- Is `react-native-css-interop` listed? (It's bundled with nativewind, shouldn't need separate install)

## 2. Tailwind config

Check for `tailwind.config.js` (NOT `.ts`):

```javascript
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: { extend: {} },
  plugins: [],
};
```

**Common mistakes**:
- Missing `nativewind/preset` in presets
- Missing content paths (styles won't generate)
- Using `.ts` extension (Tailwind v3 doesn't support it natively)

## 3. Metro config

Check `metro.config.js` for `withNativeWind()`:

```javascript
const { withNativeWind } = require("nativewind/metro");
module.exports = withNativeWind(config, {
  input: "./global.css",
});
```

**Common mistake**: Missing `input` option pointing to the global CSS file.

## 4. Babel config

Check `babel.config.js` for the nativewind preset:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
  };
};
```

**Common mistake**: Missing `jsxImportSource: "nativewind"` — this enables the className prop.

## 5. Global CSS file

Check that a global CSS entry exists (usually `global.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

And that it's imported in the app entry:

```typescript
import "./global.css";
```

## 6. TypeScript

Check for `nativewind-env.d.ts` in project root with:

```typescript
/// <reference types="nativewind/types" />
```

## 7. Common symptoms

- **"className is not a valid prop"**: Missing `jsxImportSource: "nativewind"` in babel config
- **Styles not applying**: Missing global CSS import, wrong content paths in tailwind config
- **Build errors**: Wrong Tailwind version (needs v3), missing metro config wrapper
- **Hot reload not working**: Metro transformer doesn't support fast refresh — requires full rebuild

## Approach

Ask the user what symptom they're seeing, then check the relevant configs. Read their actual files to diagnose rather than guessing.
