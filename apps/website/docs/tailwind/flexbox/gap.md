---
title: Gap
sidebar_label: Gap ⭐
---

import Compatibility from "../\_compatibility.mdx"

React Native does not have support for gap within flexbox, however we can provide a simplistic polyfill via margins. This is not a complete replacement for gap and should be used with caution.

```tsx
// With this code
<View className="gap-4">
  <Text>0</Text>
  <Text>1</Text>
  <Text>2</Text>
</View>

// It will output as this
<View style={{ margin: -2 }}>
    <Text style={{ margin: 2 }}>0</Text>
    <Text style={{ margin: 2 }}>1</Text>
    <Text style={{ margin: 2 }}>2</Text>
</View>
```

:::caution

This class only works if both the parent and it's children are transformed or wrapped in `styled`

:::

<Compatibility
supported={[
"gap-{n}",
"gap-[n]",
"gap-x-{n}",
"gap-x-[n]",
"gap-y-{n}",
"gap-y-[n]",
]}
/>
