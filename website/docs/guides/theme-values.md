# Retrieving theme values

:::tip

Please also read the [Tailwind CSS guide on referencing theme values in Javascript](https://tailwindcss.com/docs/configuration#referencing-in-java-script)

:::

It might be tempting to write to parse a Tailwind class to extract single values.

```tsx
import { useTailwind } from "tailwindcss-react-native";

export function MyActivityIndicator(props) {
  const { color } = useTailwind("text-blue-500");

  // This only works on native, and will fail on web!
  return <ActivityIndicator size="small" color={color} {...props} />;
}
```

A better solution is to either access the color directly from your theme.

```tsx
import colors from "tailwindcss/colors";

export function MyActivityIndicator(props) {
  return <ActivityIndicator size="small" color={colors.blue.500} {...props} />;
}
```

Or adding your custom colors into a shared file

```tsx
// colors.js
module.exports = {
  'tahiti': {
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
}

// tailwind.config.js
const colors = require("./colors")

module.exports = {
  theme: {
    extend: {
      colors
    }
  },
}

// MyActivityIndicator.js
import colors from "./colors";

export function MyActivityIndicator(props) {
  return <ActivityIndicator size="small" color={colors.tahiti.500} {...props} />;
}
```
