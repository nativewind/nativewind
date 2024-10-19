import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Flex Basis

## Usage

<Usage />

## Example

```SnackPlayer name=Flex Basis
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className, ...props }) => (
  <StyledText className={`flex text-center h-14 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-row h-screen items-center space-x-2">
      <Box className="basis-1/4">01</Box>
      <Box className="basis-1/4">02</Box>
      <Box className="basis-1/2">03</Box>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[ "basis-{n}", "basis-[n]" ]}
none={[
"basis-auto",
]}
/>
