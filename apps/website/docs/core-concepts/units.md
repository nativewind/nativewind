# Units

## Viewport Units

NativeWind supports the `vw` and `vh` viewport units.

```SnackPlayer name=Units
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledView className={`
      items-center
      justify-center
      bg-slate-300
      m-auto
      h-[50vh]
      w-[50vh]
    `}>
      <StyledText
        selectable={false}
        className="text-slate-800"
      >
        Rotate me! 🎉
      </StyledText>
    </StyledView>
  );
}
```
