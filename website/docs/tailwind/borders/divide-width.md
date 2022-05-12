---
title: Divide Width
sidebar_label: Divide Width ⭐
---

import Compatability from "../\_compatability.mdx"

React Native does not have support child selectors, however `styled` components are context aware and can pass down information.

```tsx
// With this code
<View className="divide-x-2">
  <Text>0</Text>
  <Text>1</Text>
  <Text>2</Text>
</View>

// It will output as this
<View>
  <Text>0</Text>
  <Text style={{ borderLeft: 2 }}>1</Text>
  <Text style={{ borderLeft: 2 }}>2</Text>
</View>
```

:::caution

This class only works if both the parent and it's children are transformed or wrapped in `styled`

:::

<Compatability
supported={[
"divide-x-{n}",
"divide-x-[n]",
"divide-y-{n}",
"divide-y-[n]",
]}
/>
