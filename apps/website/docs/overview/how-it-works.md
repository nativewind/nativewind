# How it works

During everyday use, you will not need to interact with `NativeWindStyleSheet` however it can be useful to know what the compiler is doing.

## Native platforms

When compiling for native platforms, NativeWind uses the Tailwind PostCSS plugin to pre-process your styles. While Tailwind normally outputs a CSS file, we change its output to our own `NativeWindStyleSheet`.

### Static styles

```tsx
<Text class="text-black" />;

NativeWindStyleSheet.create({
  "text-black": {
    color: "#000",
  },
});
```

As you can see, `NativeWindStyleSheet.create()` looks very similar to `StyleSheet.create()`. Under-the-hood these static styles are passed into `StyleSheet.create()` and cached.

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

A single class may compile to many atomic styles. The TailwindCSS class [container](https://tailwindcss.com/docs/container) has a base style `container` and multiple variantions based upon atRules. The `@{n}` suffix is the index of the atRule the atomic style belongs to. If the conditions of the atRule are matched, the style is applied.

### Topics

The `container` example also introducted topics. NativeWind works on a subscription model, where styles can subscribe to topics. Here the `container` style has subscribed to the `width` topic, so everytime the app's width changes the style is re-evaluated.

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

Styles can be conditional based upon a componet's or the app's state. The conditions can be UI state (active/hover), color scheme (light/dark), platform (ios/android/web), etc. These conditions are pre-computed into a bitmask for quick runtime evaluation.
