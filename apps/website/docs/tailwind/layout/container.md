# Container

:::caution
NativeWind's default breakpoints are not yet designed for native devices and still uses the web defaults.
:::

`container` is fully supported by NativeWind. Please see [Tailwind CSS documentation for usuage](https://tailwindcss.com/docs/container)

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
