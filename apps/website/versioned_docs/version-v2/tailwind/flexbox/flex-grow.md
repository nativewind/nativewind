import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Flex Grow

## Usage

<Usage />

## Example

### Grow

```SnackPlayer name=Grow
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className = '', ...props }) => (
  <StyledText className={`flex h-14 w-2/5 m-2 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-1 flex-col justify-center items-center">
      <Box className="flex-none bg-fuchsia-200">01</Box>
      <Box className="grow">02</Box>
      <Box className="flex-none bg-fuchsia-200">03</Box>
    </StyledView>
  );
}
```

### Grow-0

```SnackPlayer name=Grow
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className = '', ...props }) => (
  <StyledText className={`flex h-14 w-2/5 m-2 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-1 flex-col justify-center items-center">
      <Box className="grow bg-fuchsia-200">01</Box>
      <Box className="grow-0">02</Box>
      <Box className="grow bg-fuchsia-200">03</Box>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[
"grow",
"grow-0",
]}
/>
