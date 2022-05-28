---
slug: /
---

# Introduction

:::tip
[Want to jump straight in? Read our quick-start guide!](/quick-start)
:::

`tailwindcss-react-native` uses [Tailwind CSS](https://tailwindcss.com) as high-level scripting language to create a **universal design system**. Styled components can be shared between all React Native platforms, using the best style engine for that platform (e.g. CSS StyleSheet or StyleSheet.create). It's goals are to to provide a consistent styling experience across all platforms, improving Developer UX, component performance and code maintainability.

`tailwindcss-react-native` processes your styles during your application build, and uses a minimal runtime to selectively apply reactive styles (eg changes to device orientation, light dark mode).

> :point_right: This example uses Babel which is one of the many setups available.

```tsx
import { Pressable, View, Text } from "react-native";

/**
 * A button that changes color when hovered or pressed
 * The text will change font weight when the Pressable is pressed
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

- Works on **all** RN platforms, uses the best style system for each platform.
- Uses the Tailwind CSS compiler
- Styles are computed at **build time**
- Small runtime keeps your components fast
- Babel plugin for **simple setup** and improving **intellisense support**
- Respects all tailwind.config.js settings, including **themes, custom values, plugins**
- **dark mode / arbitrary classes / media queries**
- pseudo classes - **hover / focus / active** on compatible components [(docs)](https://tailwindcss-react-native.vercel.app/tailwind/core-concepts/pseudo-classes)
- styling based on **parent state** - automatically style children based upon parent pseudo classes [(docs)](https://tailwindcss-react-native.vercel.app/tailwind/core-concepts/component)
- **children styles** - create simple layouts based upon parent class

## Guides

- [Goals & non-goals of the project](./guides/goals) - Get familiar with the core concepts

## In action

You can use the Babel plugin to instantly start writing code! This will also enable your editor's language support and provide features such as autocomplete with no extra setup!

```tsx
import { Text } from "react-native";

export function BoldText(props) {
  return <Text className="text-bold" {...props} />;
}
```

Usage of Babel is optional! You can use the Component API to be more explicit about what gets the styles.

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";

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

Additional options can improve compatibilty with existing RN libraries

```tsx
import { Text } from "react-native";
import { styled } from "tailwindcss-react-native";
import { Svg, Circle, Rect } from "react-native-svg";

/**
 * These components can now use the "stroke" & "fill" props with Tailwind classes
 * They will use inline-props on native, and className on web.
 */
const StyledCircle = styled(Circle, { classProps: ["stroke", "fill"] });
const StyledRect = styled(Rect, { classProps: ["stroke", "fill"] });

export function BoldText(props) {
  return (
    <Svg height="50%" width="50%" viewBox="0 0 100 100">
      <StyledCircle
        cx="50"
        cy="50"
        r="45"
        stroke="stroke-blue-500 stroke-2"
        fill="color-green-500"
      />
      <StyledRect
        x="15"
        y="15"
        width="70"
        height="70"
        stroke="stroke-red-500 stroke-2"
        fill="color-yellow-500"
      />
    </Svg>
  );
}
```

Lastly `useTailwind()` can be used for manual styling or situations where `styled` cannot be used.

> :warning: This is a example of `useTailwind()` that you shouldn't use in practice. There are often more performant patterns than `useTailwind()` and it should be used as a last resort. Please see our docs for more information.

```tsx
import { ActivityIndicator } from "react-native";

export function MyText({ bold, italic, lineThrough, ...props }) {
  const tw = useTailwind();
  const { color } = useTailwind("color-black dark:color-white");

  return <ActivityIndicator color={color} />;
}
```

## See the code on Github

[![marklawlor/tailwindcss-react-native - GitHub](https://github-link-card.s3.ap-northeast-1.amazonaws.com/marklawlor/tailwindcss-react-native.png)](https://github.com/marklawlor/tailwindcss-react-native)
