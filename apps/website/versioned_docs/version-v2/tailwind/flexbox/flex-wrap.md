import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Flex Wrap

## Usage

<Usage />

## Example

```SnackPlayer name=Flex Wrap
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const Box = ({ className = '', ...props }) => (
  <StyledText className={`flex-none text-center h-14 w-2/5 m-2 justify-center items-center text-white bg-fuchsia-500 rounded ${className}`} {...props}/>
)

const App = () => {
  return (
    <StyledView className="flex flex-1 flex-col justify-between">
      <StyledView className="flex p-1 justify-center">
        <Text>flex-nowrap</Text>
        <StyledView className="flex flex-nowrap flex-row items-center">
          <Box>01</Box>
          <Box>02</Box>
          <Box>03</Box>
        </StyledView>
      </StyledView>


      <StyledView className="flex p-1 justify-center">
        <Text>flex-wrap</Text>
        <StyledView className="flex flex-wrap flex-row items-center">
          <Box>01</Box>
          <Box>02</Box>
          <Box>03</Box>
        </StyledView>
      </StyledView>

      <StyledView className="flex p-1 justify-center">
        <Text>flex-wrap-reverse</Text>
        <StyledView className="flex flex-wrap-reverse flex-row items-center">
          <Box>01</Box>
          <Box>02</Box>
          <Box>03</Box>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[
"flex-wrap",
"flex-wrap-reverse",
"flex-nowrap"
]}
/>
