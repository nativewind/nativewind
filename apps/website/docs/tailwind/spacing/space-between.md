---
title: Space between
sidebar_label: Space between ⭐
---

import Compatibility from "../\_compatibility.mdx"

React Native does not have support child selectors, however `styled` components are context aware and can pass down information.

```tsx
// With this code
<View className="space-x-1">
  <Text>0</Text>
  <Text>1</Text>
  <Text>2</Text>
</View>

// It will output as this
<View style={{ margin: -2 }}>
  <Text>0</Text>
  <Text style={{ marginLeft: 4 }}>1</Text>
  <Text style={{ marginLeft: 4 }}>2</Text>
</View>
```

:::caution

This class only works if both the parent and it's children are transformed or wrapped in `styled`

:::

<Compatibility
supported={[
"space-{n}",
"space-[n]",
"space-x-{n}",
"space-x-[n]",
"space-y-{n}",
"space-y-[n]",
]}
/>
