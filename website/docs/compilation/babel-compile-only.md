---
sidebar_position: 2
---

# Babel (compile only)

Not everyone wants their components transformed via Babel, so a compile only version of tailwindcss-react-native is available. This version just compiles and injects the Tailwind CSS styles.

## 1. Setup tailwindcss-react-native

Follow the [general setup instructions](/installation) to setup tailwindcss-react-native.

## 2. Configure your babel.config.js

```diff
// babel.config.js
module.exports = {
- plugins: ["tailwindcss-react-native/babel"],
+ plugins: [["tailwindcss-react-native/babel", { mode: "compileOnly" }],
};
```

## 3. Start Coding 🎉

Write components using the Component API

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function BoldText(props) {
  return <StyledText className="font-bold" {...props} />;
}
```
