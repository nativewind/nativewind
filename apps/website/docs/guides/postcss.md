import StartCoding from "../\_start-coding-components.md"

# PostCSS

You to use the PostCSS to generate CSS stylesheets. You can then use className to style your React Native Web components using CSS.

Before you start, please follow the [setup guide for Tailwind PostCSS](https://tailwindcss.com/docs/installation/using-postcss)

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
  plugins: [require("tailwindcss"), [require("nativewind/postcss")]],
};
```

### Start your build process

Run your build process with npm run dev or whatever command is configured in your package.json file.

This will create `nativewind-output.js`

### Import your styles

```tsx
// App.jsx
import "./nativewind-output";
```
