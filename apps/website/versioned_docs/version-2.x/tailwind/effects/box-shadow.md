import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Box Shadow

## Usage

<Usage />

:::caution

On native, shadows may not appear if a background color is not set

:::

## Example

```SnackPlayer name=Hello%20World
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledView className="flex-1 items-center justify-center">
      <StyledView className="h-[50vh] items-center justify-center shadow">
        <StyledText className="text-slate-800 shadow">Try editing me! 🎉</StyledText>
      </StyledView>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[
"shadow",
"shadow-{n}",
"shadow-none",
]}
none={[
"shadow-[n]",
"shadow-inner",
]}
/>
