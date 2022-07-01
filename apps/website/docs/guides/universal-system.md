# What problem does this solve?

## State based styling

React Native's provides StyleSheet for static styles, but all state-based styling is left to the develop to implement.

Many developers

Every library needs to solve a core problem

```tsx
/*
  This is a vanilla React Native component that changes backgroundColor based upon
  - UI State
  - Color scheme
  - Branding
*/
import { Pressable } from "react-native";
import { colors } from "./colors";

export function MyButton(props) {
  const pressableStyles = useCallback((pressed) => {
    return pressed
      ? styles[`pressable:active:${colorScheme}`]
      : styles[`pressable:${colorScheme}`]
  }, [colorScheme])

  return (
    <Pressable styles={pressableStyles} {...props} />
  );
}

const styles = StyleSheet.create({
  "pressable:light": { backgroundColor: colors["brand-600"] },
  "pressable:active:light": { backgroundColor: colors["brand-700"] }
  "pressable:dark": { backgroundColor: colors["brand-300"] },
  "pressable:active:dark": { backgroundColor: colors["brand-400"] }
})

/*
 The same component with NativeWind
 */
export function MyButton(props) {
  return <Pressable className={`
    bg-brand-600
    active:bg-brand-700
    dark:bg-brand-300
    dark:active:bg-brand-300
  `} {...props} />
}
```

You may argue that the vanilla example isn't that complex, but this is _basic example_ with only 1 component and 4 states. As you add more UI states (focus, hover) the vanilla example will grow in complexity. As your project grows you will also need more features like overriding single styles or styling based upon a different components state.

NativeWind solves the state issues for you and allows you to simply focus on your components appearance. If you need to extends or override a compoents styles, its as simple as passing the className prop.

```tsx
export function MyButton({ className, ...props }) {
  return (
    <Pressable
      className={`
    bg-brand-600
    active:bg-brand-700
    dark:bg-brand-300
    dark:active:bg-brand-300
    ${className}
  `}
      {...props}
    />
  );
}
```

For web, this library simply provides a compatibilty layer for React Native Web. You use the Tailwind CLI/Postcss like
