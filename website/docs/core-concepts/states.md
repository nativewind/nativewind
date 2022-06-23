# Hover, Focus and Other States

:::info
If you are using CSS on web, please refer to the [offical Tailwind CSS docs](https://tailwindcss.com/docs/hover-focus-and-other-states)
:::

## Hover, focus, and active

NativeWind implements a subset of the Tailwind psuedo-classes. Unlike CSS, NativeWind psuedo-classes only work on components which can accept listeners as props.

If you are using NativeWind you need to ensure these listeners are passed to the correct components

The supported psuedo-classes and their related listeners are:

| Variant  | Listeners                            |
| -------- | ------------------------------------ |
| `hover`  | `onHoverIn`, `onHoverOut`            |
| `focus`  | `onBlur`, `onFocus`                  |
| `active` | `onPress`, `onPressIn`, `onPressOut` |

## Styling based on parent state

NativeWind supports [`group` parent state](https://tailwindcss.com/docs/hover-focus-and-other-states#styling-based-on-parent-state), and a new `group-scoped` class.

The difference between `group` and `group-scoped` is that components under a `group-scoped` tree will only use the state of the closest `group-scoped` parent, while components under `group` will use the state of any parent `group`.

`group-scoped` helps apply state based styling on components that may not accept the psuedo-class listeners.

`group` and `group-scoped` both work with the `hover`/`active`/`focus` psuedo-classes.

## Responsive breakpoints

To style an element at a specific breakpoint, use responsive modifiers like `md` and `lg`.

Check out the [Responsive Design](./responsive-design) documentation for an in-depth look at how these features work.

## Prefers color scheme

Check out the [Dark Mode](./dark-mode) documentation for an in-depth look at how this feature works.

## Viewport orientation

Use the portrait and landscape modifiers to conditionally add styles when the viewport is in a specific orientation
