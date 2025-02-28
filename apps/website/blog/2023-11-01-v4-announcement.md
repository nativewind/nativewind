---
title: v4 Announcement
description: Discover the new features and improvements in NativeWind 4
slug: announcement-nativewind-v4
authors:
  - name: Mark Lawlor
    title: NativeWind author
    url: https://github.com/marklawlor
    image_url: https://github.com/marklawlor.png
    socials:
      x: mark__lawlor
      github: marklawlor
tags: [announcement, nativewind, v4]
image: https://www.nativewind.dev/img/og-image.png
hide_table_of_contents: false
---

# NativeWind v4

Dear NativeWind Community,

I'm happy to announce the release of NativeWind v4! This release is the culmination of months of work and I'm excited to share it with you. Previously NativeWind focused on static styling, simply changing `className`->`style` at build time. NativeWind v4 is a complete rewrite, and now supports highly dynamic styles, allowing you to use Tailwind CSS's full feature set.

## The Updated Architecture

NativeWind v4 has transitioned away from using a Babel plugin to a `jsxImportSource` transform. In the older architecture, Babel wrapped every component with a `className` prop in the `StyledComponent` wrapper (or you manually wrapped the component using `styled()`) and converted `className`->`style`. With the `jsxImportSource` transform, only native components need to be wrapped (`<View/>`,`<Text/>`, etc). This has has major advantages of:

1. **The `className` prop can accessed inside your components**.
1. NativeWind will wrap less components and generally only components which are leaf nodes in the render tree

Preserving the `className` prop fixes the biggest limitation and source of confusion with NativeWind, and allows you to use 3rd party `className` management libraries (`tailwind-variants`,`classnames`,`clsx`,`cva`,etc)

```tsx title=MyApp.js
// There is no need to wrap this component! `className` is accessible inside the component!
export function MyText({ className, ...props }: TextProps) {
  return <Text className={`text-black ${className}`} {...props} />;
}
```

## New Features

### CSS Variables

NativeWind has been updated to include support for CSS Custom Properties, commonly known as CSS Variables.

```jsx title=tailwind.config.js
// You can define them as a theme value
module.exports = {
  theme: {
    extend: [
      colors: {
        brand: "var(--brand-color)"
      }
    ]
  },
}
```

You can define them inline

```tsx title=App.tsx
import { vars } from "nativewind";
<View style={vars({ "--brand-color": "red" })}>
  <Text className="text-brand">Red text!</Text>
</View>;
```

Part of your theme

```jsx title=tailwind.config.js
module.exports = {
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ":root": { "--brand-color": "red" },
      });
    }),
  ],
};
```

Or directly in your CSS

```css title=global.css
/* in CSS */
:root {
  --my-brand-color: red;
}

/* including dark mode! */
@media (prefers-color-scheme: dark) {
  :root {
    --my-brand-color: blue;
  }
}
```

### Animations (experimental):

NativeWind adds experimental support for Tailwind CSS animation classes, including custom key-frame animations defined in CSS.

The animation functionality is provided by the widely-used `react-native-reanimated` package, which integrates seamlessly with NativeWind without the need for additional configuration. Just apply an animation style, and NativeWind takes care of the rest.

```jsx
// Use an existing animation class
<View className="animation-bounce" />

// Or define a custom animation in your .css
@keyframes example {
  from { background-color: red; }
  to { background-color: yellow; }
}

.my-animation {
  animation-name: example;
  animation-duration: 4s;
}

<View className="my-animation" />

```

> There is no need to use `Animated.View` or `Animated.Text`, NativeWind will automatically create animated version of your components.

### Transitions (experimental):

NativeWind adds experimental support for Tailwind CSS transition classes.

```jsx
// The color will transition over 150ms when the color scheme changes
<Text className="transition-colors text-black dark:text-white" />
```

Transitions are dynamic, and work with both Tailwind CSS and inline styles.

### Tailwind Groups and parent state modifiers

NativeWind v4 now supports the `group` and `group/<name>` syntax.

https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups

### Container Queries

Container queries enable you to apply styles to an element based on the size of the element's container, making them extremely ideal for mobile styling. While technically not part of Tailwind CSS, they are available via the official plugin (TailwindCSS Container Queries)[https://github.com/tailwindlabs/tailwindcss-container-queries].

```tsx
<View class="@container">
  <Text class="@lg:underline">
    <!-- This text will be underlined when the container is larger than `32rem` -->
  </Text>
</View>
```

A subset of the Container Query spec is also available within your CSS

```css
// The @container atRule with media based queries
@container (min-width: 700px) {
  .my-view {
  }
}

// Named container contexts
.my-container {
  container-name: sidebar;
}

@container sidebar (min-width: 700px) {
  .my-view {
  }
}
```

`container-type` and style-based container queries are not supported.

### Improved compilation

NativeWind v4 improves hot-reloading, **including hot reloading when you make change to your `tailwind.config.js` theme!**. This greatly improves the development experience and allows you to quickly iterate on designs made with NativeWind.

Additionally, the style compiler has be rewritten using [lightningcss](https://lightningcss.dev/) and should be significantly faster than v2.

### `rem` Support

NativeWind v4 includes scaling support for the `rem` unit. By default NativeWind will inline the `rem` value, replacing `rem` with `px` at build time. This greatly improves performance, but can be disabled if you need to dynamically change the `rem` value at runtime. [More information](https://www.nativewind.dev/tailwind/typography/font-size)

```jsx title=metro.config.js
export default withNativeWind(config, {
  input: "global.css",
  inlineNativeRem: false // Disable rem inlining
  // OR
  inlineNativeRem: 16 // Set a custom rem value
})
```

### Improved support for React Native core components (native only)

NativeWind v4 adds more sensible defaults for the React Native core components. These includes automatically mapping some styles to props.

```tsx
// You write
<ActivityIndicator className="bg-black text-white" />

// ❌ NativeWind v2
<ActivityIndicator style={{ backgroundColor: "rgba(0, 0, 0, 1)", color: "rgba(255, 255, 255, 1)" }}/>

// ✅ NativeWind v4
<ActivityIndicator color="rgba(255, 255, 255, 1)" style={{ backgroundColor: "rgba(0, 0, 0, 1)" }}/>
```

### Theme Functions

The theme functions have been improved and now support nested functions.

```jsx title=tailwind.config.js
import { platformSelect, platformColor, pixelRatioSelect, hairlineWidth } from "nativewind/theme"
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: platformSelect({
          ios: platformColor('label'),
          android: platformColor('?android:attr/textColor')
          default: "var(--brand-color, black)
        })
      }
      borderWidth: {
        "hw": pixelRatioSelect({
          1: hairlineWidth(),
          1.5: 1,
          default: hairlineWidth()
        })
      }
    }
  }
}
```

### React 18 Improvements

React 18 has significantly altered our approach to React applications. New features like React Server Components and the Suspense APIs necessitated a more strategic viewpoint from library authors. In response to this, NativeWind has been rewritten to ensure compatibility with Suspense APIs will work with React Server Components on web.

### React Native Web improvements

React Native Web has upcoming "compiler-less" mode which removes the built in CSS StyleSheet compiler, allows for smaller/faster web applications. As NativeWind already pre-builds your CSS, you'll be able to take advantage of this from day 1.

### Custom CSS (experimental)

You may have noticed many of our examples include raw CSS. NativeWind now supports custom CSS, allowing you to use Tailwind CSS alongside your own custom styles. Note that we currently only support a limited subset of CSS rules and properties. Further documentation is on the way.

```jsx title=global.css
@tailwind base;
@tailwind components;
@tailwind utilities;

.my-class {
  @apply text-base text-black
}

// Media queries are supported
@media (prefers-color-scheme: dark) {
  .my-class {
    @apply text-base text-white
  }
}
```

```jsx titleApp.tsx
import { Text, View } from "react-native";

export function Test() {
  return (
    <View className="container">
      <Text className="my-class">Hello world!</Text>
    </View>
  );
}
```

## Breaking Changes from v2

The introduction of a new architecture inevitably brings some breaking changes.

### Removal of `styled()`

There are two reasons for the removal of `styled()`. As explained above NativeWind no longer needs to wrap every component removing the primary need for the `styled()` wrapper. While the new APIs `enablePropRemap`/`enableCSSInterop` serve similar purposes, you should be using them significantly less than `styled()`.

Secondly, NativeWind v4 is making a philosophical choice to be a _styling_ library, not a _component_ library. The difference is small, but there is a important distinction in terms of API coverage. `styled()` allowed you to create components because _NativeWind incompatible with popular 3rd party component/variant libraries_ and we believed that restriction greatly reduced the development experience when using NativeWind. NativeWind v4 has now "fixed" `className`, removing that restriction and allowing you to use which ever library best fits your use-case.

NativeWind does not offer a migration path for components using `styled()`, however the library [tw-classed](https://tw-classed.vercel.app/docs/guide/react-native) offers a very similar API and should provide you with a straight forward migration (**note**: You can now skip step 2)

```tsx title=App.js"
import { Text as RNText } from "react-native";
import { classed } from "@tw-classed/react";

export const Text = classed(RNText, "text-black", {
  variants: {
    color: {
      blue: "text-blue-500",
      green: "text-green-500",
    },
  },
});

const App = () => {
  return <Text color="blue">Hello, tw-classed!</Text>;
};
```

### CSS Specificity

NativeWind has change its specificity algorithm. You can read more about it here: https://www.nativewind.dev/core-concepts/style-specificity

### Base Scaling Modifications

NativeWind now processed the `rem` unit, a significant change affecting all `rem` based styles. Previously, NativeWind matched Tailwind CSS documentation's scaling, replacing `rem` values with their `px` equivalents. Now, the default `rem` value is set to 14, aligning with `<Text />` default. As a result, your app might appear smaller due to the scale change from the static 16px to 14. To revert to the previous behavior, set the `inlineNativeRem` option in your `withNativeWind` config:

```jsx
jsxCopy code
// metro.config.js
export default withNativeWind(config, {
  input: "global.css",
  inlineNativeRem: 16 // Modify this
})
```

### `gap-` polyfill has been removed

`gap` now compiles to the native `columnGap` and `rowGap` styles. Previously NativeWind tried to mimic this behavior using `margin` and the removal of the polyfill may affect your layouts.

### useColorScheme()

`setColorScheme` and `toggleColorScheme` will throw an error unless `darkMode: 'dark'` is set in your `tailwind.config.js`.

### Removal of `group-isolate` and `parent`

With the new support for Tailwind **[groups](https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups)**, **`group-isolate`** and **`parent`** are superseded. This feature necessitates Tailwind CSS 3.2.

https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups

### `divide-` and `spacing-` temporary unavailable

The `divide-` and `spacing-` utilities will be unavailable at the launch of v4 and will be re-added in a future version. Previously these utilities were poly-filled and we are exploring better ways to re-implement them.

### `NativeWindStyleSheet` renamed to `StyleSheet`

The StyleSheet exported from NativeWind now extends `StyleSheet` from React Native and can be used a drop in replacement.

### New `fontFamily` defaults

NativeWind v4 adds new defaults for the font family class names. You can override these defaults in your `tailwind.config.js`. We

```jsx
import { platformSelect } from "nativewind/theme"

module.exports = {
  theme: {
    fontFamily: {
      sans: platformSelect({
        android: 'san-serif',
        ios: 'system font',
        web: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
      }),
      serif: platformSelect({
        android: 'serif',
        ios: 'Georgia'
        web: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
      }),
      mono: platformSelect({
        android: 'mono',
        ios: 'Courier New'
        web: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
      }),
    }
  }
}
```

### `pixelRatio` / `fontScale()`

`pixelRatio` and `fontScale` have been updated so they now return the respective value. If a number is passed as an argument, it will be multiplied by the value.

`pixelRadio(2) = PixelRatio.get() * 2`

There are two new functions `pixelRatioSelect` and `fontScaleSelect`. These work similar to `Platform.select`

```
pixelRatioSelect({
  2: '1.2rem'
  default: '1rem'
})
```

### Miscellaneous Updates

- `aspect` no longer uses a polyfills and adopt native styling.
- NativeWind no longer exports a PostCSS plugin. Use the Tailwind CLI if you wish to generate the `.css` file manually.
- `NativeWindStyleSheet.setOutput()` has been removed. Output is now determined by your Metro targeted platform.
- `border-0.5` has been renamed to `border-hairline`

## Breaking changes from v3 beta

If you were using the v3 beta, these are some additional breaking changes

### Variant API Discontinuation

We had introduced variant support for `styled()` in the cancelled v3 beta, based on the `class-variance-authority` library. We recommend users to shift to (`tailwind-variants`)[https://www.tailwind-variants.org/], enhancing control over styling and aligning NativeWind with evolving coding practices.

### setVariables() has been removed

Simply add the variables to a component’s style tag using the new `vars()` function. See the New Features for more information.

### Misc

- `useUnsafeVariable` has been removed. Use `useUnstableNativeVariables` instead.
- `setDirection()` has been removed. Use `I18nManager.forceRTL` instead.
- `**odd/even/first/last`: These modifiers are temporary unavailable. They will be added in a future version.
- `NativeWindStyleSheet.getSSRStyles()` has been removed and is no longer required.

## New API

### `remapProps`

`propRemap` accepts a `Component` as the first argument and a mapping as the second. The mapping is in the format `{ [existing prop]: [new prop] | true }`, and it returns a typed version of the component.

An example of how NativeWind maps `<FlatList />` is:

```jsx
remapProps(FlatList, {
  style: "className",
  ListFooterComponentStyle: "ListFooterComponentClassName",
  ListHeaderComponentStyle: "ListHeaderComponentClassName",
  columnWrapperStyle: "columnWrapperClassName",
  contentContainerStyle: "contentContainerClassName",
});

// Now you can use FlatList with the added props
<FlatList className="w-10" ListHeaderComponentClassName="bg-black" />;
```

`remapProps` is a lightweight wrapper which doesn't generate any styles. Instead it converts Tailwind CSS strings to `OpaqueStyleTokens` (readonly empty objects). These tokens should be treat just any other other style object, and once passed to a component tagged with `remapProps`, they will be converted into styles.

(See the documentation for more information)[https://www.nativewind.dev/api/remap-props]

**`cssInterop(component, mapping)`**

`cssInterop` signals to NativeWind that a specific component should be treated as a primitive. On this component, it sets up the dynamic style logic.

Before using `cssInterop` you should could consider if `remapProps` would be more suitable. The main reasons to use `cssInterop` are:

- The component renders a Native Component
- Moving a style property to an prop
  - Note: If this is not a 3rd party component, you should consider simply using the style prop as this will not work on web.

(See the documentation for more information)[https://www.nativewind.dev/api/css-interop]

### `vars()`

`vars()` allow you can create inline CSS Variables that will be shared by React Context to all children.
