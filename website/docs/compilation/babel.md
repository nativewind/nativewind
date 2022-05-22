import StartCoding from "../\_start-coding.md"

# Babel

The default babel configuration will both compile/inject the Tailwind CSS styles and transform any component with the `className` attributed into a `styled` version.

This is the recommended configuration as it provides the fastest setup and best DX experience, with support for Tailwind intellisense within your IDE.

```tsx
/* Example how your code will look */
import { Text } from "react-native";

export function MyFancyButton(props) {
  return (
    <Pressable className="component bg-violet-500 hover:bg-violet-600 active:bg-violet-700">
      <Text className="font-bold component-active:font-extrabold" {...props} />;
    </Pressable>
  );
}
```

## Setup

### 1. Configure your babel.config.js

```js
// babel.config.js
module.exports = {
  plugins: ["tailwindcss-react-native/babel"],
};
```

### 2. Style components using the className prop

```tsx
import { Text } from "react-native";

export function BoldText(props) {
  return <Text className="font-bold" {...props} />;
}
```

<StartCoding />

## Typescript

Create a file (eg. `src/tailwindcss-react-native.d.ts`) and paste this line

```js
import "tailwindcss-react-native/types.d";
```

## Configuring what is transformed

When targeting `Web` you may be using components that should not be transformed.

By default native components (e.g. `div`) are not transformed.

However if you are using a `web` only library such as `react-select`, you can disabled the transform on components imported from this library.

Either by explicitly stating which modules can be transformed.

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
