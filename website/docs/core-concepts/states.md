# Hover, Focus and Other States

NativeWind polyfills a subset of the Tailwind states for React Native by adding event listeners on your components. This documentation only applies when compiling for native or when `webOutput` is set to `native`.

When using CSS on web, please refer to the [offical Tailwind CSS docs](https://tailwindcss.com/docs/hover-focus-and-other-states).

## Hover, focus, and active

NativeWind implements a subset of the Tailwind psuedo-classes. Unlike CSS, NativeWind psuedo-classes only work on components which can accept listeners as props.

If you are using NativeWind you need to ensure these listeners are passed to the correct components

The supported psuedo-classes and their related listeners are:

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

NativeWind supports [`group` parent state](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state), and a new `group-isolate` class.

The difference between `group` and `group-isolate` is that components under a `group-isolate` tree will only use the state of the closest `group-isolate` parent, while components under `group` will use the state of any parent `group`.

`group-isolate` helps apply state based styling on components that may not accept the psuedo-class listeners.

`group` and `group-isolate` both work with the `hover`/`active`/`focus` psuedo-classes.

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
          Text in a child group - hover and click me!
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
