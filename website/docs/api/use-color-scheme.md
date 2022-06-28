---
title: useColorScheme()
sidebar_label: useColorScheme()
---

useColorScheme() provides access to the devices color scheme.

| Value             | Description                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------ |
| colorScheme       | The current device colorScheme                                                                         |
| setColorScheme    | Override the current colorScheme with a different scheme (accepted values are `light`/`dark`/`system`) |
| toggleColorScheme | Toggle the color scheme between `light` and `dark`                                                     |

You can also manually change the color scheme via `NativeWindStyleSheet.setColorScheme(colorScheme)`

```tsx
import { useColorScheme } from "tailwindcss-react-native";
import { Text } from "react-native";

function MyComponent() {
  const { colorScheme, setColorScheme } = useColorScheme();

  return (
    <Text
      onPress={() => setColorScheme(colorScheme === "light" ? "dark" : "light")}
    >
      {`The color scheme is ${colorScheme}`}
    </Text>
  );
}
```
