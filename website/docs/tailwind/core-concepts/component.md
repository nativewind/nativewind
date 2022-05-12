---
title: Styling based on parent state
sidebar_label: Parent state styling ⭐
---

### Group

`Coming soon`

### Component 🆕

Component is a new class added to share parent state. It functions similar to [group](#group) except it is scoped.

### Group vs Component

The core difference is that component is scoped while group isn't.

**Group**

In this example, the `<Text>` will change color when either `<Pressable>` is active.

```tsx
<Pressable className="group">
  <Text>Hello</Text>
  <Pressable className="group">
    <Text className="group-active:text-red-500">world!</Text>
  </Pressable>
</Pressable>
```

**Component**

In this example, the `<Text>` will change color only when its parent `<Pressable>` is active.

```tsx
<Pressable className="component">
  <Text>Hello</Text>
  <Pressable className="component">
    <Text className="component-active:text-red-500">world!</Text>
  </Pressable>
</Pressable>
```
