---
title: Home
slug: /
pagination_prev: null
pagination_next: null
custom_edit_url: null
---

# Overview

## What is NativeWind?

Do you like using Tailwind CSS to style your apps? This helps you do that in React Native. NativeWind is not a component library, it's a styling library. If you're looking for component libraries that support NativeWind, see [Component Libraries](../guides/component-libraries).

NativeWind makes sure you're using the best styling engine for any given platform (e.g. CSS StyleSheet on web and StyleSheet.create for native). It's primary goal is to provide a consistent styling experience across all platforms via robust coverage of Tailwind CSS. We believe that this is at the core of an exceptional developer experience. As we begin to wrap up this robust coverage, we have begun focus on our secondary goal, component performance.

NativeWind processes your styles during your application's build step and uses a minimal runtime to selectively apply reactive styles (eg changes to device orientation, light dark mode).

NativeWind allows you to use [Tailwind CSS](https://tailwindcss.com) to style your components in React Native. Styled components can be shared between all React Native platforms, using the best style engine for that platform; CSS StyleSheet on web and StyleSheet.create for native. It's goals are to provide a consistent styling experience across all platforms, improving Developer UX, component performance and code maintainability.

On native platforms, NativeWind performs two functions. First, at build time, it compiles your Tailwind CSS styles into `StyleSheet.create` objects and determines the conditional logic of styles (e.g. hover, focus, active, etc). Second, it has an efficient runtime system that applies the styles to your components. This means you can use the full power of Tailwind CSS, including media queries, container queries, and custom values, while still having the performance of a native style system.

On web, NativeWind is a small polyfill for adding `className` support to React Native Web.

## Key Features

🌐 **Universal** - Uses the best styling engine for each platform - CSS StyleSheet on web, StyleSheet.create for native

🖥️ **Developer UX** - Simple setup with plugins for improved intellisense support and automatic TypeScript configuration

🎨 **CSS Variables** - Create themes, sub-themes and dynamic styles using CSS custom properties (variables) that work across platforms

✨ **Robust Animations** - Full support for Tailwind's animation classes and custom keyframe animations via react-native-reanimated

🔄 **Transitions** - Smooth transitions between style states, including dark mode changes and dynamic updates

👪 **Tailwind Groups & Parent State** - Style children based on parent state using Tailwind's group syntax and modifiers [(docs)](../core-concepts/states#hover-focus-and-active#styling-based-on-parent-state)

📱 **Media & Container Queries** - Responsive styles using modern mobile features like media and container queries [(docs)](../core-concepts/states#hover-focus-and-active)

✨ **Pseudo classes** hover / focus / active on compatible components [(docs)](../core-concepts/states#hover-focus-and-active)

📏 **rem Support** - Use `rem` units consistently across platforms with automatic conversion

🔍 **Dot Notation Support** - Access nested style properties using familiar dot notation

🎯 **Custom CSS** - Write custom CSS that gets compiled to native styles while preserving performance

## In action

NativeWind handles both the Tailwind CSS compilation and the runtime styles. It works via a JSX transform, meaning there is no need for custom wrappers/boilerplate.

As all React components are transformed with JSX, it works with 3rd party modules. This assumes that the 3rd party module in question allows you to pass through the `className` prop.

```tsx
import { CustomText } from "third-party-text-component";

export function BoldText(props) {
  // You just need to write `className="<your styles>"`
  return <CustomText className="text-bold" {...props} />;
}
```

Styling can by dynamic and you can perform conditional logic and build up complex style objects.

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

## Manually styling components via `cssInterop()` and `remapProps()`

By default NativeWind maps `className`->`style`, but it can handle the mapping of complex components. If you'd like to manually wrap a component, you can use `cssInterop()` [docs](). If you run into any performance issues, we suggest trying out `remapProps()`. While less robust in its coverage, it should lead to improved performance.

```tsx
remapProps(FlatList, {
  className: "style",
  ListFooterComponentClassName: "ListFooterComponentStyle",
  ListHeaderComponentClassName: "ListHeaderComponentStyle",
  columnWrapperClassName: "columnWrapperStyle",
  contentContainerClassName: "contentContainerStyle",
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
import { cssInterop } from "nativewind";
import { Svg, Circle } from "react-native-svg";

/**
 * Circle uses `height`/`width` props on native and className on web
 */
const StyledSVG = cssInterop(Svg, {
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
const StyledCircle = cssInterop(Circle, {
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
