import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Flex Direction

## Usage

<Usage />

:::tip
React Native has a different default flex direction to web. We highly recommend explicting setting the Flex Direction on your components.
:::

## Example

```SnackPlayer name=Flex Row
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className = '', ...props }) => (
  <StyledText className={`flex text-center h-14 w-14 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-row h-screen space-x-2">
      <Box>01</Box>
      <Box>02</Box>
      <Box>03</Box>
    </StyledView>
  );
}
```

```SnackPlayer name=Flex Row Reverse
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className = '', ...props }) => (
  <StyledText className={`flex text-center h-14 w-14 m-2 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-row-reverse h-screen">
      <Box>01</Box>
      <Box>02</Box>
      <Box>03</Box>
    </StyledView>
  );
}
```

```SnackPlayer name=Flex Col
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className = '', ...props }) => (
  <StyledText className={`flex text-center h-14 w-14 m-2 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-col h-screen">
      <Box>01</Box>
      <Box>02</Box>
      <Box>03</Box>
    </StyledView>
  );
}
```

```SnackPlayer name=Flex Col Reverse
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className = '', ...props }) => (
  <StyledText className={`flex text-center h-14 w-14 m-2 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-col-reverse h-screen">
      <Box>01</Box>
      <Box>02</Box>
      <Box>03</Box>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[
"flex-row",
"flex-row-reverse",
"flex-col",
"flex-col-reverse",
]}
/>
