# Hover, Focus and Other States

When compiling for React Native, NativeWind emulates CSS states .

Please refer to the [documentation on the Tailwind CSS website](https://tailwindcss.com/docs/hover-focus-and-other-states) for more information.

## Hover, focus, and active

:::note
This documentation only applies when compiling for StyleSheet.create
:::

NativeWind implements a subset of the Tailwind pseudo-classes by adding event listeners on your components, hence they will only work on components that can accept the listener.

The supported pseudo-classes and their related listeners are:

| Variant  | Event Listeners           |
| -------- | ------------------------- |
| `hover`  | `onHoverIn`, `onHoverOut` |
| `focus`  | `onBlur`, `onFocus`       |
| `active` | `onPressIn`, `onPressOut` |

```SnackPlayer name=States
import { Text, Pressable } from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledPressable className={`
      flex-1
      items-center
      justify-center
      hover:bg-slate-300
      active:bg-slate-500
    `}>
      <StyledText
        selectable={false}
        className="text-slate-800"
      >
        Hover and click me! 🎉
      </StyledText>
    </StyledPressable>
  );
}
```

## Styling based on parent state

NativeWind supports the [`group` parent state](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state) and a new `group-isolate` class.

The `group` classes creates an unbounded scope, while `group-isolate` creates a bounded scope. The primary purpose of `group-isolate` is for state styling on components which do not accept the needed state listeners.

`group` and `group-isolate` both work with the `hover`/`active`/`focus` pseudo-classes.

```SnackPlayer name=States
import { Text, Pressable } from 'react-native';
import { styled } from 'nativewind';

const StyledPressable = styled(Pressable)
const StyledText = styled(Text)

const App = () => {
  return (
    <StyledPressable className={`
      flex-1
      items-center
      justify-center
      group-isolate
    `}>
      <StyledText className={`
        text-slate-800
        group-isolate-hover:text-blue-500
        group-isolate-active:text-red-500
      `}>
        Hover and click me! 🎉
      </StyledText>
      <StyledPressable className={`
        group-isolate
        bg-slate-300
        h-20
      `}>
        <StyledText className={`
          text-slate-800
          group-isolate-hover:text-blue-500
          group-isolate-active:text-red-500
        `}>
          Child group-isolate have their own state!
        </StyledText>
      </StyledPressable>
    </StyledPressable>
  );
}
```

## Responsive breakpoints

To style an element at a specific breakpoint, use responsive modifiers like `md` and `lg`.

Check out the [Responsive Design](./responsive-design) documentation for an in-depth look at how these features work.

## Prefers color scheme

Check out the [Dark Mode](./dark-mode) documentation for an in-depth look at how this feature works.

## Viewport orientation

Use the portrait and landscape modifiers to conditionally add styles when the viewport is in a specific orientation
