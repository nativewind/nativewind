---
sidebar_position: 1
---

# Babel

The default babel configuration will both compile/inject the Tailwind CSS styles and transform any component with the `className` attributed into a `styled` version.

## 1. Setup tailwindcss-react-native

Follow the [general setup instructions](../installation.md) to setup tailwindcss-react-native.

## 2. Configure your babel.config.js

```js
// babel.config.js
module.exports = {
  plugins: ["tailwindcss-react-native/babel"],
};
```

## 3. Style components using the className prop

```tsx
import { Text } from "react-native";

export function BoldText(props) {
  return <Text className="font-bold" {...props} />;
}
```

## 4. Typescript support (optional)

Create a file (eg. `src/tailwindcss-react-native.d.ts`) and paste this line

```js
import "tailwindcss-react-native/types.d";
```

## 5. Configuring what is transformed (optional)

When targetting `Web` you may be using components that youdo not want transformed.

By default native components (e.g. `div`) are not transformed.

However if you are using a `web` only library such as `react-select`, you can disabled the transform on components imported from this library.

Either by explictly listing which modules can be transformed.

```diff
// babel.config.js
module.exports = {
- plugins: ["tailwindcss-react-native/babel"],
+ plugins: [
+   [
+    "tailwindcss-react-native/babel"
+    { allowModuleTransform: ["moti"] }
+   ]
+ ],
};
```

Or blocking modules you don't want transformed.

```diff
// babel.config.js
module.exports = {
- plugins: ["tailwindcss-react-native/babel"],
+ plugins: [
+   [
+    "tailwindcss-react-native/babel"
+    { blockModuleTransform: ["react-select"] }
+   ]
+ ],
};
```
