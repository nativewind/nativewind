---
slug: /
sidebar_position: 1
---

# Introduction

:::tip
[Want to jump straight in? Read our quick-start guide!](/quick-start)
:::

`tailwindcss-react-native` uses [Tailwind CSS](https://tailwindcss.com) as **universal design system** for all React Native platforms. It lets you share code between all React Native platforms and improves DX, performance and code maintainability.

It is powered by the Tailwind CSS compiler to process the styles, themes, responsive and conditional logic. The styles can than be used as React Native Stylesheets or as CSS - whatever suits your platform best!

## Features

- Works on all RN platforms (including Web, Macos & Windows)
- Uses the Tailwind compiler
- Can be used with either React Native or CSS StyleSheets!
- Babel plugin for simple setup, or can integrate with your tooling
- Fast refresh compatible
- Respects all tailwind.config.js settings, including themes, custom values, plugins
- Supports dark mode / arbitrary classes / media queries
- Styles processed at build time - not runtime

## In action

You can use the Babel plugin to instantly start writing code! This will also enable your editor's language support and provide features such as autocomplete.

```tsx
import { Text } from "react-native";

export function BoldText(props) {
  // Thanks to Babel, I just work :)
  return <Text className="text-bold" {...props} />;
}
```

Or use the Component API to be more explicit about what gets the styles.

```tsx
import { Text } from "react-native";
import { styles } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function BoldText(props) {
  return <StyledText className="text-bold" {...props} />;
}
```

You still have the ability to perform conditional logic and built up complex style objects.

```tsx
import { Text } from "react-native";

export function MyText({ bold, italic, lineThrough, ...props }) {
  const classNames = [];

  if (bold) classNames.push("font-bold");
  if (italic) classNames.push("italic");
  if (lineThrough) classNames.push("line-through");

  return <Text className={classNames.join(" ")} {...props} />;
}
```

And access the styles directly

```tsx
import { Text } from "react-native";
import { useTailwind } from "tailwindcss-react-native";

export function MyActivityIndicator(props) {
  const tw = useTailwind();

  const { color } = tx("text-blue-500");

  return <ActivityIndicator size="small" color={color} {...props} />;
}
```
