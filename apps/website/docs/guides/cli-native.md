import StartCoding from "../\_start-coding-components.md"

# Tailwind CLI (Native)

The Tailwind CLI can be used to output pre-compiled RN StyleSheet objects.

## Setup

### 1. Create a PostCSS config file

```js
// postcss.config.js
module.exports = {
  plugins: {
    "nativewind/postcss": {
      output: "nativewind-output.js",
    },
  },
};
```

### 2. Add the NativeWind plugin to your `tailwind.config.js`

```diff
// tailwind.config.js
+ const nativewind = require("nativewind/tailwind/native")
+
module.exports = {
  content: [
    './App.{js,ts,jsx,tsx}',
  ],
+ plugins: [nativewind()],
};
```

### 2. Create a input file

```css
// input.css
@tailwind components;
@tailwind utilities;
```

### 3. Run Tailwind CLI

Running the Tailwind CLI will generate `nativewind-output.js`.

```bash
npx tailwindcss -i input.css --postcss postcss.config.js
```

### 4. Import your styles

```tsx
// App.jsx
+ import "./nativewind-output"
```

<StartCoding />

## Watching for changes

You can use the Tailwind CLI with the `--watch` flag to automatically compile on save.

This can be combined with [concurrently](https://www.npmjs.com/package/concurrently) to create a streamlined development environment.

```diff
// package.json
{
  "scripts": {
-   "start": "expo start"
+   "start": "concurrently \"tailwindcss -i input.css --postcss postcss.config.js --watch\" \"expo start\""
  },
  // ...
}
```
