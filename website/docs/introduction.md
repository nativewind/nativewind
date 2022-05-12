---
slug: /
---

# Introduction

:::tip
[Want to jump straight in? Read our quick-start guide!](/quick-start)
:::

`tailwindcss-react-native` uses [Tailwind CSS](https://tailwindcss.com) as **universal design system** for all React Native platforms. It lets you share code between all React Native platforms and improves DX, performance and code maintainability.

At during your applications build, it uses the Tailwind CSS compiler to process the styles, themes, and conditional logic. It uses a minimal runtime to selectively apply reactive styles (eg changes to device orientation).

```tsx
import { Text } from "react-native";

/**
 * A button that changes color when hovered or pressed
 * The text will change font weight when pressed
 */
export function MyFancyButton(props) {
  return (
    <Pressable className="component bg-violet-500 hover:bg-violet-600 active:bg-violet-700">
      <Text className="font-bold component-active:font-extrabold" {...props} />;
    </Pressable>
  );
}
```

## Features

- Works on **all** RN platforms
- Uses the Tailwind compiler - **styles computed at build time**
- Babel plugin for **simple setup** and better **intellisense support**
- Respects all tailwind.config.js settings, including **themes, custom values, plugins**
- **dark mode / arbitrary classes / media queries**
- pseudo classes - **hover / focus / active** on compatble components [(docs)](./tailwind/core-concepts/pseudo-classes)
- styling based on **parent state** - automacialy style children based upon parent psuedo classes [(docs)](./tailwind/core-concepts/component)
- **children styles** - create simple layouts based upon parent class

## In action

You can use the Babel plugin to instantly start writing code! This will also enable your editor's language support and provide features such as autocomplete.

```tsx
import { Text } from "react-native";

export function BoldText(props) {
  return <Text className="font-bold" {...props} />;
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

## See the code on Github

[![marklawlor/tailwindcss-react-native - GitHub](https://github-link-card.s3.ap-northeast-1.amazonaws.com/marklawlor/tailwindcss-react-native.png)](https://github.com/marklawlor/tailwindcss-react-native)
