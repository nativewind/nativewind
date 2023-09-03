# Overview

## What is NativeWind?

NativeWind allows you to use [Tailwind CSS](https://tailwindcss.com) to style your components in React Native. Styled components can be shared between all React Native platforms, using the best style engine for that platform; CSS StyleSheet on web and StyleSheet.create for native. It's goals are to provide a consistent styling experience across all platforms, improving Developer UX, component performance and code maintainability.

NativeWind processes your styles during your application's build step and uses a minimal runtime to selectively apply responsive styles (eg changes to device orientation, color scheme).

```tsx
import { Text, View } from "react-native";
import { Component } from "third-party-library";

const App = () => {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-slate-800">Styling just works! 🎉</Text>
      <Component className="text-slate-800">
        You can style 3rd party components
      </Component>
    </View>
  );
};
```

## Key Features

🌐 **Universal** Uses the best style system for each platform.

🛠️ **Build time** Uses the Tailwind CSS compile, styles are generated at build time

🚀 **Fast runtime** Small runtime keeps everything fast. `~10kb` on native (without animations) and `3kb` on web.

🖥️ **DevUX** Plugins for simple setup and improving intellisense support

✨ **Media & Container queries** Use modern mobile styling features like media and container queries [(docs)](../core-concepts/states#hover-focus-and-active)

👪 **Custom values (CSS Variables)** Create themes, sub-themes and dynamic styles using custom values

✨ **Pseudo classes** hover / focus / active on compatible components [(docs)](../core-concepts/states#hover-focus-and-active)

👪 **Parent state styles** automatically style children based upon parent pseudo classes [(docs)](../core-concepts/states#hover-focus-and-active#styling-based-on-parent-state)

🔥 **Lots of other features**

- dark mode
- arbitrary classes
- platform selectors
- plugins

## How is this different StyleSheet.create?

A full featured style system should have

- Static styles
- UI state styles (active, hover, focus, etc)
- Responsive styles (media queries, dynamic units)
- Container queries (styling based upon parent appearance)
- Device state styles (orientation, color scheme)
- Use the best rendering engine available

React Native's StyleSheet system only provides static styles, with other features left for the user to implement. By using NativeWind you can focus on writing your system instead of building your own custom style system.

On web, CSS already has all these features and is highly optimized. `StyleSheet.create` injects the CSS stylesheet at runtime, breaking SSR and slowing down performance. The majority of web frameworks have first-party support for Tailwind CSS, so we can leverage their build system.

This is what makes NativeWind a universal style system - it allows you to use the same components with rich styles on all React Native platforms.

## In action

NativeWind handles both the Tailwind CSS compilation and the runtime styles. It works via a JSX transform, meaning there is no need for custom wrappers/boilerplate.

As all React components are transformed with JSX, it works with 3rd party modules.

```tsx
import { CustomText } from "third-party-text-component";

export function BoldText(props) {
  // You just need to write `className="<your styles>"`
  return <CustomText className="text-bold" {...props} />;
}
```

Styling can by dynamic and you can perform conditional logic and built up complex style objects.

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

By default NativeWind maps `className`->`style`, but it can handle the mapping of complex components.

```tsx
remapClassNameProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
  indicatorClassName: "indicatorStyle",
});

<FlatList
  {...}
  className="bg-black"
  ListHeaderComponentClassName="bg-black text-white"
  ListFooterComponentClassName="bg-black text-white"
  columnWrapperClassName="bg-black"
  contentContainerClassName="bg-black"
  indicatorClassName="bg-black"
/>
```

And can even work with components that expect style attributes as props

```tsx
import { Text } from "react-native";
import { enableCSSInterop } from "nativewind";
import { Svg, Circle } from "react-native-svg";

/**
 * Circle uses `height`/`width` props on native and className on web
 */
const StyledSVG = enableCSSInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: {
      height: true,
      width: true,
    },
  },
});
/**
 * Circle uses `fill`/`stroke`/`strokeWidth` props on native and className on web
 */
const StyledCircle = enableCSSInterop(Circle, {
  className: {
    target: "style",
    nativeStyleToProp: {
      fill: true,
      stroke: true,
      strokeWidth: true,
    },
  },
});

export function BoldText(props) {
  return (
    <Svg className="w-1/2 h-1/2" viewBox="0 0 100 100">
      <StyledCircle
        className="fill-green-500 stroke-blue-500 stroke-2"
        cx="50"
        cy="50"
        r="45"
      />
    </Svg>
  );
}
```
