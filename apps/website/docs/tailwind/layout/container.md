import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Container

:::caution
NativeWind's default breakpoints are not yet designed for native devices and still uses the web defaults.
:::

## Usage

<Usage />

## Example

```SnackPlayer name=Container
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledView className="container bg-slate-300 items-center">
      <StyledText className="text-slate-800">Try editing me! 🎉</StyledText>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[
"container",
]}
/>
