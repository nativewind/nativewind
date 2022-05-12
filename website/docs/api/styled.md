---
title: styled()
sidebar_label: styled()
---

## Usage

`styled` is a [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) which allows your component to accept either the `tw` or `className` props. These props are compiled into StyleSheet objects and passed to your component via the `style` prop.

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

## Advanced usage

### inheritedClassName

    nthChild,
