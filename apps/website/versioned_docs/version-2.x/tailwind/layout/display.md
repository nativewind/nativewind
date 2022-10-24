import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Display

## Usage

<Usage />

## Example

```SnackPlayer name=Display
import { Text, View } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledView className="flex-1 items-center justify-center">
      <StyledText className="text-slate-800 flex">
        Try editing me! 🎉
      </StyledText>
      <StyledText className="text-slate-800 hidden">
         I'm hidden
      </StyledText>
    </StyledView>
  );
}
```

## Compatibility

<Compatibility
supported={[ "flex", "hidden" ]}
none={[
"block",
"inline-block",
"inline",
"inline-flex",
"table",
"inline-table",
"table-caption",
"table-cell",
"table-column",
"table-column-group",
"table-footer-group",
"table-header-group",
"table-row-group",
"table-row",
"flow-root",
"grid",
"inline-grid",
"contents",
"list-item",
]}
/>
