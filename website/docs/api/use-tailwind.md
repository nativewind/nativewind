---
sidebar_position: 1
title: useTailwind
sidebar_label: useTailwind()
---

Components can have multiple style props, or you may need programmatic access to the generated styles. In these instances you can use the `useTailwind` hook.

```tsx
import { MotiView } from "moti";
import { useTailwind } from "tailwindcss-react-native";

export function MyComponent() {
  const tw = useTailwind();

  const opacity0 = tw("opacity-0");
  const opacity1 = tw("opacity-1");

  return <MotiView from={opacity0} animate={opacity1} exit={opacity0} />;
}
```
