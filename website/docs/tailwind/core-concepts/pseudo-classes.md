---
title: Pseudo Classes
sidebar_label: Pseudo Classes ⭐
---

React Native does not have support for pseudo classes, however they can be implemented via event listeners. The Babel transform & components wrapped in `styled` will automatically have these listeners added.

```tsx
<Pressable className="bg-violet-500 hover:bg-violet-600 active:bg-violet-700">
  <Text {...props} />;
</Pressable>
```

### Handling Hover, Focus, and Active

These pseudo classes will only work on components that accept the required listeners.

| Class    | Listeners                            |
| -------- | ------------------------------------ |
| `hover`  | `onHoverIn`, `onHoverOut`            |
| `focus`  | `onBlur`, `onFocus`                  |
| `active` | `onPress`, `onPressIn`, `onPressOut` |
