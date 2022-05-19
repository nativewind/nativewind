---
title: styled()
sidebar_label: styled()
---

## Usage

`styled()` is a [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) which allows your component to accept either the `tw` or `className` props. These props are compiled into StyleSheet objects and passed to your component via the `style` prop.

There is no difference between `tw` and `className`, but `tw` has priority.

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function MyComponent() {
  return (
    <>
      <StyledText tw="font-bold">Hello world</StyledText>
      <StyledText className="font-bold">Hello world</StyledText>
    </>
  );
}
```

## Styling multiple properties

`styled()` can optionally accept a list of additional props to parse into runtime styles.

```tsx
function Wrapper({ innerStyle, children, ...props }) {
  return (
    <View {...props}>
      <View style={innerStyle}>
        { children }
      </View>
    </View>
  )
}

const StyledWrapper = styled(Wrapper, { props: ["innerStyle"] })

<StyledWrapper className="h-4" innerStyle="p-4"><Text>Hello, World!</Text></StyledWrapper>
```
