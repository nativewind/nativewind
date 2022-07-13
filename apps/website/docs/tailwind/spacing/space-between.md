import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Space between

## Usage

<Usage />

## How it works

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

## Compatibility

<Compatibility
supported={[
"space-{n}",
"space-[n]",
"space-x-{n}",
"space-x-[n]",
"space-y-{n}",
"space-y-[n]",
]}
none={[
"space-x-reverse",
"space-y-reverse",
]}
/>
