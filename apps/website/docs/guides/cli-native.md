# Tailwind CLI

The Tailwind CLI can be used to output pre-compiled RN StyleSheet objects.

Before you start, please follow the [setup guide for Tailwind CLI](https://tailwindcss.com/docs/installation)

## Web

### Add the NativeWind plugin to your `tailwind.config.js`

```diff
// tailwind.config.js
+ const nativewind = require("nativewind/tailwind/css")
+
module.exports = {
  content: [
    './App.{js,ts,jsx,tsx}',
  ],
+ plugins: [nativewind()],
};
```

## Native

### Add NativeWind to your PostCSS config

Add tailwindcss and to your `postcss.config.js`.

```js
// postcss.config.js
module.exports = {
  plugins: [require("tailwindcss"), require("nativewind/postcss")],
};
```

### Create a PostCSS config file

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

### Add the NativeWind plugin to your `tailwind.config.js`

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

### Run Tailwind CLI

Running the Tailwind CLI will generate `nativewind-output.js`.

```bash
npx tailwindcss -i input.css --postcss postcss.config.js
```

### Import your styles

```tsx
// App.jsx
+ import "./nativewind-output"
```

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
