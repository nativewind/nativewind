---
slug: /
---

# Overview

## What is NativeWind?

NativeWind uses [Tailwind CSS](https://tailwindcss.com) as scripting language to create a **universal styling system**. Styled components can be shared between all React Native platforms, using the best style engine for that platform; CSS StyleSheet on web and StyleSheet.create for native. It's goals are to to provide a consistent styling experience across all platforms, improving Developer UX, component performance and code maintainability.

NativeWind processes your styles during your application's build and uses a minimal runtime to selectively apply responsive styles (eg changes to device orientation, color scheme).

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

## Key Features

🌐 **Universal** Uses the best style system for each platform.

🛠️ **Build time** Uses the Tailwind CSS compile, styles are generated at build time

🚀 **Fast runtime** Small runtime keeps everything fast

🖥️ **DevUX** Plugins for simple setup and improving intellisense support

🔥 **Lots of features** dark mode / arbitrary classes / media queries / themes / custom values / plugins

✨ **Pseudo classes** hover / focus / active on compatible components [(docs)](https://nativewind.vercel.app/tailwind/core-concepts/pseudo-classes)

👪 **Parent state styles** automatically style children based upon parent pseudo classes [(docs)](https://nativewind.vercel.app/tailwind/core-concepts/component)

## What is a universal style system?

A full featured style system should have

- Static styles
- UI state styles (active, hover, focus, etc)
- Responsive styles (media queries, dynamic units)
- Device state styles (orientation, color scheme)
- Styling inheritance
- Use the best rendering engine available

React Native's StyleSheet system only provides static styles, with other features left for the user to implement. By using NativeWind you can focus on writing your system instead of building your own custom style system.

On web, CSS already has all these features and is highly optimised. While on web NativeWind provides a compatibilty layer between React Native and CSS.

This is what makes NativeWind a universal style system - it allows you to use the same components with rich styles on all React Native platforms.

## Why Tailwind CSS?

While we would love to port CSS to React Native, the core philosophy between the two systems are too different. So the next best approach is to use a style pre-processor that can compile to both to _both_ CSS and React Native StyleSheets.

The project originally was going to use a custom style language, but we quickly realised that Tailwind CSS was mature and matched all our core needs; it is language agnostic and shares the same core philosophy as React Native: every style should be atomic, including state-based styling.

So we adopted the Tailwind CSS language and haven't looked back!

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
import { styled } from "nativewind";

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
import { styled } from "nativewind";
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
