# Nativewind v4

Dear Nativewind Community,

We are delighted to announce the alpha of Nativewind v4. This fresh update presents a multitude of improvements, innovative features, and enhancements that significantly bolster the capabilities of Nativewind. Committed to our philosophy of "Write once, style anywhere," Nativewind continuously challenges its limits, delivering an intuitive and dynamic experience. This update includes everything from an overhauled API to new utilities, improved performance, and broader compatibility - all of which we are eager to share with you.

Let us first address a significant update concerning Nativewind version 3 beta. As you may recall, we had initially planned to launch the third iteration of Nativewind. However, during its development, it became clear that the proposed re-architecture did not meet our future requirements. Plans were made to migrate part of the Nativewind code base to the Expo organization, necessitating a re-design of Nativewind's architecture. We apologize for the communication gap as we navigated these changes. Thankfully, this intensive research period resulted in the fruitful development of Nativewind v4.

We're well aware it's been some time since our last update, and in recognition of that we're releasing as an **early alpha preview**. Hopefully this introduces some visibility into the ongoing work. It's crucial to underscore that this release is a **preview version** and may still undergo significant changes. While we've strived to ensure a solid release, it hasn't undergone extensive testing, and we anticipate there may be various issues that need resolving before we transition to a stable release. So, without further ado, let's delve into the changes introduced in v4.

## The Updated Architecture

Nativewind v4 is distinguished by its transition to a `jsxImportSource` transform, making the previous babel plugin redundant. In the older architecture, babel wrapped every component with a `className` in the `StyledComponent` wrapper (or it was manually wrapped using `styled()`). This wrapper converted the `className` prop into the injected `StyleSheet` styles. Now, with the `jsxImportSource` transform, this conversion happens at the `jsx` level, **allowing for the `className` prop to be accessed inside a component, and permitting it to be passed or altered for child components**. This change eradicates a major limitation of Nativewind and encourages component styling via widely used tools like `classnames`, `clsx`, or `cva`.

This `jsx` transform also substantially enhances performance, applying the transform only to leaf components (e.g., `View`, `Text`) rather than higher-level custom components. For example, in the case of the `FlatList` component, which comprises several sub-components, dynamic style changes will only re-render the `View` within your `ListFooterComponent`. This improvement is especially crucial as Nativewind v4 introduces a host of new dynamic styles!

This architectural revision also solves Nativewind's second major issue - compatibility with Metro and Babel cache. With the new architecture, Nativewind now seamlessly integrates with the Metro cache, speeding up build times and **supporting fast refresh when updates are made to your theme in `tailwind.config.js`**. These enhancements emphasize our dedication to delivering a more efficient and streamlined development experience.

## Breaking Changes from v2

The introduction of a new architecture inevitably brings some breaking changes.

### Removal of `styled()`

Among the major transformations in the Nativewind v4 library is the removal of the `styled()` helper function. Previously, the `styled()` function served a dual role, assisting users who chose not to use the Babel plugin while offering a simple way to create styled components.

However, with v4, Nativewind has evolved to directly pass the `className` prop into components, allowing users to modify it more traditionally. This significant change paves the way for the inclusion of popular utility libraries, thereby broadening the versatility of Nativewind.

For creating `styled()` components, a common practice was to rebind `style` props to `className` props. For the most part, this will now be handled automatically, however if you are using a 3rd party component with multiple `style` props you will need to bind these to a class prop. Please see the `bindProps` section the `New API` for more information.

### Base Scaling Modifications

Nativewind now processed the `rem` unit, a significant change affecting all `rem` based styles. Previously, Nativewind matched Tailwind CSS documentation's scaling, replacing `rem` values with their `px` equivalents. Now, the default `rem` value is set to 14, aligning with `<Text />` default. As a result, your app might appear smaller due to the scale change from the static 16px to 14. To revert to the previous behavior, set the `inlineRem` option in your `withNativewind` config:

```jsx
jsxCopy code
// metro.config.js
export default withNativewind(config, {
  input: "global.css",
  inlineRem: 16 // Modify this
})

```

### `gap-` polyfill has been removed

`gap` now compiles to the native `columnGap` and `rowGap` styles. Previously Nativewind tried to mimic this behavior using `margin` and the removal of the polyfill may affect your layouts.

### useColorScheme()

`setColorScheme` and `toggleColorScheme` will throw an error unless `darkMode: 'dark'` is set in your `tailwind.config.js`.

### Removal of `group-isolate` and `parent`

With the new support for Tailwind **[groups](https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups)**, **`group-isolate`** and **`parent`** are superseded. This feature necessitates Tailwind CSS 3.2.

https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups

### `divide-` and `spacing-` temporary unavailable

The `divide-` and `spacing-` utilities will be unavailable at the launch of v4 and will be re-added in a future version. Previously these utilities were poly-filled and we are exploring better ways to re-implement them.

### `NativewindStyleSheet` renamed to `StyleSheet`

The StyleSheet exported from Nativewind now extends `StyleSheet` from React Native and can be used a drop in replacement.

### Custom Webpack support discontinued

Maintenance issues led us to remove webpack support. With Expo sunsetting webpack and popular web frameworks also moving away from webpack, the userbase requiring a custom webpack configuration. If a community member want to take over support, we're open to linking to their solution in the docs.

### Miscellaneous Updates

- Theme functions such as `hairlineWidth` and `platformSelect` are now exported from `nativewind/theme`, necessitating import updates.
- `aspect` no longer uses a polyfills and adopt native styling.
- Nativewind no longer exports a PostCSS plugin. Use the Tailwind CLI if you wish to generate the `.css` file manually.
- Control of `NativewindStyleSheet.setOutput()` is now determined by your Metro targeted platform.

## Breaking changes from v3 beta

If you were using the v3 beta, these are some additional breaking changes

### Variant API Discontinuation

We had introduced variant support for `styled()` in the cancelled v3 beta, based on the `class-variance-authority` library. We recommend users to shift to `cva`, enhancing control over styling and aligning Nativewind with evolving coding practices.

### setVariables() has been removed

Simply add the variables to a component’s style tag to set the variables for the subtree. See the New Features for more information.

### Misc

- `useUnsafeVariable` has been removed. Use `useUnstableNativeVariables` instead.
- `setDirection()` has been removed. Use `I18nManager.forceRTL` instead.
- `**odd/even/first/last`: These modifiers are temporary unavailable. They will be added in a future version.
- `NativewindStyleSheet.getSSRStyles()` has been removed and is no longer required.

## New Features

### CSS Variables

Nativewind has been updated to include support for CSS Custom Properties, commonly known as CSS Variables. You now have the flexibility to define these variables in a variety of ways: within your `tailwind.config.js`, inline on individual components, or directly via CSS.

```jsx

// in your theme
module.exports = {
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        ":root": { "--my-brand-color": "red" },
        "*": { "--my-brand-color": "blue" },
      })
    })
  ]
}

// inline on a component (using the new `vars`` export - see New API for more information)
import { vars } from "nativewind"
<View style={vars({ "--my-brand-color": "red" })} />

// in CSS
:root {
  --my-brand-color: red;
}

* {
  --my-brand-color: blue;
}
```

**`:root` and `*` selectors**

The `:root` and `*` CSS selectors are two special CSS selectors that disobey Nativewind standard "class only selector" rule. Both selectors mimic the standard CSS behavior, but can only contain CSS variables - style definitions will be ignored.

`:root` - Set CSS variables at the root of your application
`*` - Set default CSS variables for all components. These override any cascading variables

Additionally these selectors have special syntax to enable their Dark Mode variations.

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* ... */
  }

  * {
    /* ... */
  }
}

/* If you have defined `darkMode: 'class'` in your tailwind.config.js` */
:root .dark {
  /* ... */
}
.dark * {
  /* ... */
}
```

**Dynamic Variables**

You can use CSS variables with class selectors just like normal styles, and they can be applied with modifiers or within `@media` and `@container` queries.

```css
@media (min-width: 1270px) {
  .my-class {
    /* Your variables here, they will only be applied when the @media query is matched */
  }
}
```

### `rem` Support

Nativewind v4 includes `rem` unit support, changing the default scaling to `14`. If you need to modify the default `rem` value or disable `rem` inlining, adjust your `metro.config.js`:

```jsx
javascriptCopy code
// metro.config.js
export default withNativewind(config, {
  input: "global.css",
  inlineRem: false // Disable rem inlining
  // OR
  inlineRem: 16 // Set a custom rem value
})
```

### Container Queries

Container queries enable you to apply styles to an element based on the size of the element's container, making them extremely ideal for mobile styling. Nativewind 4.0 adds support for the (TailwindCSS Container Queries official plugin)[https://github.com/tailwindlabs/tailwindcss-container-queries].

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

### Tailwind Groups and parent state modifiers

TODO

https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups

### Theme Functions

TODO

### Nested CSS Functions

Natvewind v4 now allows you to nest CSS functions to create complex rules

```css
.text {
  color: var(
    --text-color,
    platformSelect(
      ios/platformColor(label),
      android/platformColor("?android:attr/textColor"),
      default/var(--color, black)
    )
  );
}
```

### React 18 Improvements

The emergence of React 18 has significantly altered our approach to React applications. New features like React Server Components and the Suspense APIs necessitated a more strategic viewpoint from library authors. In response to this, Nativewind v4 has been upgraded to ensure compatibility with Suspense APIs, such as `startTransition`, and is fully prepared for React Server Components (RSC) when building for the web.

An upcoming minor version of Nativewind is set to support RSC in native applications. This proactive step ensures that as soon as a native framework offers support for RSC, Nativewind users will be ready to utilize the new capabilities.

## Experimental Features

These features are part of v4, but to be considered experimental, possibly incomplete and will not follow semver. Do not expect these features to be 'stable' before the release of v4.

#### Animations & Transitions (experimental):

Nativewind now supports Tailwind CSS animation classes along with custom key-frame animations defined in CSS.

The animation functionality is provided by the widely-used `react-native-reanimated` package, which integrates seamlessly with Nativewind without the need for additional configuration. Just apply an animation style, and Nativewind takes care of the rest.

```jsx
<View className="animation-bounce" />

// OR define a custom animation in your .css

@keyframes example {
  from { background-color: red; }
  to { background-color: yellow; }
}

.my-animation {
  animation-name: example;
  animation-duration: 4s;
}

<View className="my-animation" />


// The color will transition over 150ms when the color scheme changes
<Text className="transition-colors text-black dark:text-white" />
```

> There is no need to use `Animated.View` or `Animated.Text`, Nativewind will automatically create animated version of your components.

#### Custom CSS (experimental)

Write custom styles directly in your `.css` files. Note that we currently only support a limited subset of CSS rules and properties. Further documentation is on the way.

```jsx
// global.css
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

// App.tsx
import { Text, View } from "react-native";

export function Test() {
  return (
    <View className="container">
      <Text className="my-class">Hello world!</Text>
    </View>
  );
}
```

## New API

### `vars()`

TODO

### `bindProps`

In earlier versions, the `styled()` function was utilized to generate new `className` props when a component had multiple `style` props. Now, with Nativewind only converting the `className` on primitive components (e.g., `<View>`), it becomes necessary to communicate to Nativewind that a component is complex and requires appropriate style distribution. The `bindProps` wrapper serves this purpose.

`bindProps` accepts a `Component` as the first argument and a mapping as the second. The mapping is in the format `{ [existing prop]: [new prop] | true }`, and it returns a typed version of the component.

> Note: While bindProps might seem like a direct replacement for styled(), the two function differently. bindProps transforms classes into an object, but this object is not a style object. It may lack properties and should not be altered.

An example of how Nativewind binds `<FlatList />` is:

```jsx
bindProps(FlatList, {
  style: "className",
  ListFooterComponentStyle: "ListFooterComponentClassName",
  ListHeaderComponentStyle: "ListHeaderComponentClassName",
  columnWrapperStyle: "columnWrapperClassName",
  contentContainerStyle: "contentContainerClassName",
  indicatorStyle: "indicatorClassName",
});
```

Following this binding, you can utilise the new props on **`<FlatList />`**:

```jsx
<FlatList className="w-10" ListHeaderComponentClassName="bg-black" />
```

For TypeScript users, guides on creating declaration files to type 3rd party components correctly will be available. Alternatively, you can directly use the returned component:

```jsx
jsxCopy code
const StyledComponent = bindProps(MyComponent, {
  props: {
    style: "className",
    otherStyle: "otherClassName",
  }
});

```

**`enableCSSInterop(component, mapping)`**

`enableCSSInterop` signals to Nativewind that a specific component should be treated as a primitive. On this component, it sets up the dynamic style logic.

Nativewind automatically enables the interop for the following components:

```jsx
enableCSSInterop(ActivityIndicator, { className: "style" });
enableCSSInterop(Image, { className: "style" });
enableCSSInterop(Pressable, { className: "style" });
enableCSSInterop(Text, { className: "style" });
enableCSSInterop(View, { className: "style" });
enableCSSInterop(StatusBar, { barClassName: "barStyle" });
```

> **Warning: Before using `enableCSSInterop`, carefully consider its potential performance impact. If an animation class is involved, the whole component will be animated.**

One typical use case is with `react-native-svg`, where styles need to be mapped to props. Components like `Rect` are also leaf components and will not have performance impacts if re-rendered.

```tsx

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect from } 'react-native-svg';

enableCSSInterop(Svg, {
  "className": {
    target: "style",
    nativeStyleToProp: { width: true, height: true }
  },
});
enableCSSInterop(Circle, {
  "className": {
    target: "style",
    nativeStyleToProp: { width: true, height: true, stroke: true, fill: tru }
  },
});
enableCSSInterop(Rect, {
  "className": {
    target: "style",
    nativeStyleToProp: { width: true, height: true, stroke: true, fill: tru }
  },
});

export default class SvgExample extends React.Component {
  render() {
    return (
      <View className="inset-0 items-center content-center"      >
        <Svg
          className="h-1/2 w-1/2"
          viewBox="0 0 100 100"
        >
          <Circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-blue-500 stroke-2 fill-green-500"
          />
          <Rect
            x="15"
            y="15"
            className="prop-width:w-16 prop-height:h-16 stroke-red-500 stroke-2 fill-yellow-500"
          />
        </Svg>
      </View>
    );
  }
}
```

### `useUnstableNativeVariables()`

CSS variables, while highly useful, are largely write-only and cannot be read at runtime. This limitation is due to performance constraints on the web, particularly when attempting to retrieve the current value of a CSS variable for a given subtree.

Web components are conventionally styled using either the className or style attributes, a strategy that makes efficient use of CSS variables. Regrettably, this approach isn't consistently adopted across the native ecosystem.

To provide a solution for native components that need to access a CSS variable’s value, we have useUnstableNativeVariables(). This hook can be more efficient than nativeStyleToProp because it bypasses the need to engage enableCSSInterop on the component.

> It's crucial to avoid using this hook within a web component and restrict its use to .native.js files. Failure to heed this warning will result in an error.

Moreover, this hook is not intended for access to static theme values. If you need to reference a static theme value, the Tailwind documentation provides examples on how to accomplish this in JavaScript: https://tailwindcss.com/docs/configuration#referencing-in-java-script

While useUnstableNativeVariables() is a viable solution in certain situations, there are usually better design patterns to adopt. For example, if your use case involves a color value from a dynamically changing theme (such as a user-generated color palette), creating a Context Provider might be a more efficient and reliable approach. This provider can establish the context and assign the CSS variables accordingly.

```tsx
const ThemeContext = createContext();

export function ThemeProvider({ value, children }) {
  return (
    <ThemeContext.Provider value={value}>
      <View style={vars({ "--brand-color": value.brandColor })}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
```
