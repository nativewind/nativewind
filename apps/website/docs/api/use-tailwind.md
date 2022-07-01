---
title: useTailwind
sidebar_label: useTailwind()
---

`useTailwind()` is a low level hook to manually subscribe to `NativeWindStyleSheet`. Unlike `styled()` and `<StyledComponent />`, it requires the user to manual manage component state like `hover`/`active`/`focus`.

This hook is designed for advanced use-cases only.

::: note

While ios and android will return an array with your styles, some platforms uses numerical style IDs.

Please see [retrieving theme values](../guides/theme-values) if you want programmatic access to your theme.

:::

```tsx
import { Text } from "react-native";
import { useTailwind } from "nativewind";

export function MyComponent() {
  const textStyles = useTailwind("hover:text-red-500", {
    hover: true,
  });

  return <Text style={viewStyles} />;
}
```
