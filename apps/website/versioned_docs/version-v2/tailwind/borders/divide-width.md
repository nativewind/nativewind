import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Divide Width

## Usage

<Usage />

## How it works

React Native does not have support child selectors, so the `styled` components clones its children and appends the child styles.

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

## Compatibility

<Compatibility
supported={[
"divide-x-{n}",
"divide-x-[n]",
"divide-y-{n}",
"divide-y-[n]",
]}
/>
