# Aspect Ratio

Aspect ratio is fully supported by NativeWind. Please see [Tailwind CSS documentation for usuage](https://tailwindcss.com/docs/aspect-ratio)

```SnackPlayer name=Aspect Ratio
import { View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)

const App = () => {
  return (
    <StyledView className="flex-1 justify-center items-center space-y-2">
      <StyledView className="w-24 aspect-square bg-slate-500" />
      <StyledView className="w-24 aspect-video bg-slate-500" />
    </StyledView>
  );
}
```
