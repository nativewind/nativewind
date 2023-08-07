import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Gap

## Usage

<Usage />

## How it works

React Native does not have support for gap within flexbox, however we can provide something similar via margins. This is not a complete replacement for gap and should be used with caution. You most likely also need to add widths and overflow-hidden to achieve your desired effect.

```tsx
// With this code
<View className="gap-4">
  <Text>0</Text>
  <Text>1</Text>
  <Text>2</Text>
</View>

// It will output as this
<View style={{ marginLeft: -4, marginTop: -4 }}>
    <Text style={{ marginLeft: 4, marginTop: 4  }}>0</Text>
    <Text style={{ marginLeft: 4, marginTop: 4  }}>1</Text>
    <Text style={{ marginLeft: 4, marginTop: 4  }}>2</Text>
</View>
```

## Example

```SnackPlayer name=Gap
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)
const Box = ({ className, ...props }) => (
  <StyledText className={`flex flex-1 text-center h-14 basis-[32] justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-row flex-wrap h-screen w-screen content-center items-center gap-2 overflow-hidden">
      <Box>01</Box>
      <Box>02</Box>
      <Box>03</Box>
      <Box>04</Box>
      <Box>05</Box>
      <Box>06</Box>
    </StyledView>
  );
}
```

## Compatibility

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
