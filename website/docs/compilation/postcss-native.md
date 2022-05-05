---
sidebar_position: 3
sidebar_label: PostCSS (RN StyleSheet)
---

# Using PostCSS (RN StyleSheet)

## 1. Setup tailwindcss-react-native

Follow the [general setup instructions](../installation.md) to setup tailwindcss-react-native.

## 2. Create a PostCSS config file

Add tailwindcss and to your postcss.config.js file, or wherever PostCSS is configured in your project.

```js
// postcss.config.js
module.exports = {
  plugins: [
    require("tailwindcss"),
    [
      require("tailwindcss-react-native/postcss"),
      {
        /* options */
      },
    ],
  ],
};
```

## 3. Add the `@tailwind` directives

Add the @tailwind directives for each of Tailwind’s layers to your main CSS file.

```css
// base.css
@tailwind components;
@tailwind utilities;
```

## 4. Start your build process

Run your build process with npm run dev or whatever command is configured in your package.json file.

This will create `tailwindcss-react-native-output.js`

## 5. Update the TailwindProvider

```diff
import { TailwindProvider } from 'tailwindcss-react-native'
+ import * as tailwindProviderProps from "./tailwindcss-react-native-output"

function MyAppsProviders ({ children }) {
    return (
-       <TailwindProvider>{children}</TailwindProvider>
+       <TailwindProvider {...tailwindProviderProps}>{children}</TailwindProvider>
    )
}
```

## 6. Write components using the Component API

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function BoldText(props) {
  return <StyledText className="font-bold" {...props} />;
}
```
