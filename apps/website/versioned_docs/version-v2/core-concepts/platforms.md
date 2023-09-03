# Platforms

## Styling per platform

Styles can be applied selectively per platform using a platform variant. Additionally the `native` variant can be used to target all platforms except for web.

| Variants  |
| --------- |
| `ios`     |
| `android` |
| `web`     |
| `windows` |
| `macos`   |

```SnackPlayer name=Platform Prefixes
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledView className="flex-1 items-center justify-center">
      <StyledText className={`
        ios:text-red-500
        android:text-blue-500
        web:text-green-600
      `}>
        Text color changes per Platform! 🎉
      </StyledText>
    </StyledView>
  );
}
```
