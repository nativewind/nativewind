# Top / Right / Bottom / Left

Top / Right / Bottom / Left is fully supported by NativeWind. Please see [Tailwind CSS documentation for usuage](https://tailwindcss.com/docs/top-right-bottom-left)

```SnackPlayer name=Top / Right / Bottom / Left
import { View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)

function Box({ className, children }) {
  return (
    <StyledView className="relative h-20 w-20 bg-violet-300">
      <StyledView className={`
        absolute
        bg-violet-600
        justify-center
        items-center
        ${className}
      `}>
        {children}
      </StyledView>
    </StyledView>
  )

}

const App = () => {
  return (
    <StyledView className="w-screen h-screen shrink flex-row flex-wrap justify-between">
      <Box className="left-0 top-0 h-8 w-8">01</Box>
      <Box className="left-0 inset-x-0 h-8">02</Box>
      <Box className="top-0 right-0 h-8 w-8">03</Box>
      <Box className="inset-y-0 left-0 w-8">04</Box>
      <Box className="inset-0">05</Box>
      <Box className="inset-y-0 right-0 w-8">06</Box>
      <Box className="bottom-0 left-0 h-8 w-8">07</Box>
      <Box className="inset-x-0 bottom-0 h-8">08</Box>
      <Box className="bottom-0 right-0 h-8 w-8">09</Box>
    </StyledView>
  );
}
```
