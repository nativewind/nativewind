import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Line Height

## Usage

<Usage />

## Example

```SnackPlayer name=Hello%20World
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledView className="flex-1 items-center justify-center">
      <StyledText className="leading-3">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consectetur mattis velit at lobortis. Nullam commodo mi et ultricies placerat. Donec ac accumsan mi. Cras ac porttitor arcu. Maecenas molestie euismod nulla, eget vestibulum enim pharetra ac.</StyledText>
      <StyledText className="leading-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras consectetur mattis velit at lobortis. Nullam commodo mi et ultricies placerat. Donec ac accumsan mi. Cras ac porttitor arcu. Maecenas molestie euismod nulla, eget vestibulum enim pharetra ac.</StyledText>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[
"leading-{n}",
"leading-[n]",
]}
none={[
"leading-none",
"leading-tight",
"leading-snug",
"leading-normal",
"leading-relaxed",
"leading-loose",
]}
/>
