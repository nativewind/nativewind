# How it works

This guide is not required to use NativeWind, it's simply an explanation of what is it does.

## Web

When running on the web, NativeWind passes your styles as `className` props, allowing you to use CSS StyleSheets!

NativeWind adds some plugins to Tailwind, which allows it to understand NativeWind features such as platform variants.

## Native

React Native doesn't have a CSS engine, so NativeWind needs to process the CSS output into StyleSheet objects.

NativeWind uses the Tailwind to process your styles to CSS and then compiles that CSS into NativeWindStyleObjects. These are passed to `NativeWindStyleSheet.create`, which is a small wrapper around `StyleSheet.create`.

### Static styles

```tsx
<Text class="text-black" />;

NativeWindStyleSheet.create({
  "text-black": {
    color: "#000",
  },
});
```

`NativeWindStyleSheet.create()` looks very similar to `StyleSheet.create()`. Under-the-hood these static styles are passed into `StyleSheet.create()` and cached.

### Dynamic styles

```tsx
<View class="container" />;

NativeWindStyleSheet.create({
  styles: {
    container: {
      width: "100%",
    },
    "container@0": {
      maxWidth: 640,
    },
    "container@1": {
      maxWidth: 768,
    },
    "container@2": {
      maxWidth: 1024,
    },
    "container@3": {
      maxWidth: 1280,
    },
    "container@4": {
      maxWidth: 1536,
    },
    "font-bold": {
      fontWeight: "700",
    },
  },
  atRules: {
    container: [
      [["media", "(min-width: 640px)"]],
      [["media", "(min-width: 768px)"]],
      [["media", "(min-width: 1024px)"]],
      [["media", "(min-width: 1280px)"]],
      [["media", "(min-width: 1536px)"]],
    ],
  },
  topics: {
    container: ["width"],
  },
});
```

The TailwindCSS class [container](https://tailwindcss.com/docs/container) has a base style `container` and multiple variations based upon atRules. The `@{n}` suffix is the index of the atRule the atomic style belongs to. If the conditions of the atRule are matched, the style is applied.

### Topics

The `container` example also introduced topics. NativeWind works on a subscription model, where styles can subscribe to topics. Here the `container` style has subscribed to the `width` topic, so each time the app's width changes the style is re-evaluated.

### Dynamic Units

```tsx
<View class="w-screen" />;

NativeWindStyleSheet.create({
  styles: {
    "w-screen": {
      width: 100,
    },
  },
  topics: {
    "w-screen": ["width"],
  },
  units: {
    "w-screen": { width: "vw" },
  },
});
```

Topics are not just for atRules and can be used for multiple purposes. The topic subscription model also allows us to implement dynamic units.

### State

```tsx
<Text class="text-black ios:text-blue-500" />;

NativeWindStyleSheet.create({
  styles: {
    "text-black": {
      color: "#000",
    },
    "ios:text-blue-500": {
      width: "rgb(59 130 246)",
    },
  },
  masks: {
    "ios:text-blue-500": 8192,
  },
});
```

Styles can be conditional based upon a component's or the app's state. The conditions can be UI state (active/hover), color scheme (light/dark), platform (ios/android/web), etc. These conditions are pre-computed into a bitmask for quick runtime evaluation.

### Child Styles

For all styles are for the component, some are for it's children.

```tsx
<Text class="divide-x" />;

NativeWindStyleSheet.create({
  styles: {
    "divide-x-2.children@0": {
      borderLeftWidth: 2,
      borderRightWidth: 0,
    },
  },
  atRules: {
    "divide-x-2.children": [[["selector", "(> *:not(:first-child))"]]],
  },
  childClasses: {
    "divide-x-2": ["divide-x-2.children"],
  },
});
```
