# NativeWind v4

Dear NativeWind Community,

We are delighted to announce the alpha of NativeWind v4. This fresh update presents a multitude of improvements, innovative features, and enhancements that significantly bolster the capabilities of NativeWind. Committed to our philosophy of "Write once, style anywhere," NativeWind continuously challenges its limits, delivering an intuitive and dynamic experience. This update includes everything from an overhauled API to new utilities, improved performance, and broader compatibility - all of which we are eager to share with you.

Let us first address a significant update concerning NativeWind version 3 beta. As you may recall, we had initially planned to launch the third iteration of NativeWind. However, during its development, it became clear that the proposed re-architecture did not meet our future requirements. Plans were made to migrate part of the NativeWind code base to the Expo organization, necessitating a re-design of NativeWind's architecture. We apologize for the communication gap as we navigated these changes. Thankfully, this intensive research period resulted in the fruitful development of NativeWind v4.

We're well aware it's been some time since our last update, and in recognition of that we're releasing as an **early alpha preview**. Hopefully this introduces some visibility into the ongoing work. It's crucial to underscore that this release is a **preview version** and may still undergo significant changes. While we've strived to ensure a solid release, it hasn't undergone extensive testing, and we anticipate there may be various issues that need resolving before we transition to a stable release. So, without further ado, let's delve into the changes introduced in v4.

## The Updated Architecture

NativeWind v4 is distinguished by its transition to a `jsxImportSource` transform, making the previous babel plugin redundant. In the older architecture, babel wrapped every component with a `className` in the `StyledComponent` wrapper (or it was manually wrapped using `styled()`). This wrapper converted the `className` prop into the injected `StyleSheet` styles. Now, with the `jsxImportSource` transform, this conversion happens at the `jsx` level, **allowing for the `className` prop to be accessed inside a component, and permitting it to be passed or altered for child components**. This change eradicates a major limitation of NativeWind and encourages component styling via widely used tools like `classnames`, `clsx`, or `cva`.

This `jsx` transform also substantially enhances performance, applying the transform only to leaf components (e.g., `View`, `Text`) rather than higher-level custom components. For example, in the case of the `FlatList` component, which comprises several sub-components, dynamic style changes will only re-render the `View` within your `ListFooterComponent`. This improvement is especially crucial as NativeWind v4 introduces a host of new dynamic styles!

This architectural revision also solves NativeWind's second major issue - compatibility with Metro and Babel cache. With the new architecture, NativeWind now seamlessly integrates with the Metro cache, speeding up build times and **supporting fast refresh when updates are made to your theme in `tailwind.config.js`**. These enhancements emphasize our dedication to delivering a more efficient and streamlined development experience.

## Breaking Changes from v2

The introduction of a new architecture inevitably brings some breaking changes.

### Removal of `styled()`

Among the major transformations in the NativeWind v4 library is the removal of the `styled()` helper function. Previously, the `styled()` function served a dual role, assisting users who chose not to use the Babel plugin while offering a simple way to create styled components.

However, with v4, NativeWind has evolved to directly pass the `className` prop into components, allowing users to modify it more traditionally. This significant change paves the way for the inclusion of popular utility libraries, thereby broadening the versatility of NativeWind.

For creating `styled()` components, a common practice was to rebind `style` props to `className` props. For the most part, this will now be handled automatically, however if you are using a 3rd party component with multiple `style` props you will need to bind these to a class prop. Please see the `remapClassNameProps` section the `New API` for more information.

### Base Scaling Modifications

NativeWind now processed the `rem` unit, a significant change affecting all `rem` based styles. Previously, NativeWind matched Tailwind CSS documentation's scaling, replacing `rem` values with their `px` equivalents. Now, the default `rem` value is set to 14, aligning with `<Text />` default. As a result, your app might appear smaller due to the scale change from the static 16px to 14. To revert to the previous behavior, set the `inlineRem` option in your `withNativeWind` config:

```jsx
jsxCopy code
// metro.config.js
export default withNativeWind(config, {
  input: "global.css",
  inlineRem: 16 // Modify this
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

We had introduced variant support for `styled()` in the cancelled v3 beta, based on the `class-variance-authority` library. We recommend users to shift to `cva`, enhancing control over styling and aligning NativeWind with evolving coding practices.

### setVariables() has been removed

Simply add the variables to a component’s style tag to set the variables for the subtree. See the New Features for more information.

### Misc

- `useUnsafeVariable` has been removed. Use `useUnstableNativeVariables` instead.
- `setDirection()` has been removed. Use `I18nManager.forceRTL` instead.
- `**odd/even/first/last`: These modifiers are temporary unavailable. They will be added in a future version.
- `NativeWindStyleSheet.getSSRStyles()` has been removed and is no longer required.

## New Features

### CSS Variables

NativeWind has been updated to include support for CSS Custom Properties, commonly known as CSS Variables. You now have the flexibility to define these variables in a variety of ways: within your `tailwind.config.js`, inline on individual components, or directly via CSS.

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

The `:root` and `*` CSS selectors are two special CSS selectors that disobey NativeWind standard "class only selector" rule. Both selectors mimic the standard CSS behavior, but can only contain CSS variables - style definitions will be ignored.

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
.dark {
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

NativeWind v4 includes `rem` unit support, changing the default scaling to `14`. If you need to modify the default `rem` value or disable `rem` inlining, adjust your `metro.config.js`:

```jsx
javascriptCopy code
// metro.config.js
export default withNativeWind(config, {
  input: "global.css",
  inlineRem: false // Disable rem inlining
  // OR
  inlineRem: 16 // Set a custom rem value
})
```

### Container Queries

Container queries enable you to apply styles to an element based on the size of the element's container, making them extremely ideal for mobile styling. NativeWind 4.0 adds support for the (TailwindCSS Container Queries official plugin)[https://github.com/tailwindlabs/tailwindcss-container-queries].

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

This also includes default "className" props for all core component style props

```tsx
<FlatList
  className="<className>"
  ListHeaderComponentClassName="<className>"
  ListFooterComponentClassName="<className>"
  columnWrapperClassName="<className>"
  contentContainerClassName="<className>"
  indicatorClassName="<className>"
/>
```

### Tailwind Groups and parent state modifiers

https://tailwindcss.com/docs/hover-focus-and-other-states#differentiating-nested-groups

NativeWind v4 now supports the `group` and `group/<name>` syntax.

### Theme Functions

TODO

### Nested CSS Functions

NativeWind v4 now allows you to nest CSS functions to create complex rules

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

The emergence of React 18 has significantly altered our approach to React applications. New features like React Server Components and the Suspense APIs necessitated a more strategic viewpoint from library authors. In response to this, NativeWind v4 has been upgraded to ensure compatibility with Suspense APIs, such as `startTransition`, and is fully prepared for React Server Components (RSC) when building for the web.

An upcoming minor version of NativeWind is set to support RSC in native applications. This proactive step ensures that as soon as a native framework offers support for RSC, NativeWind users will be ready to utilize the new capabilities.

### React Native Web improvements

React Native Web has upcoming "compiler-less" mode which removes the built in CSS StyleSheet compiler. As NativeWind pre-builds your CSS, you'll be able to take advantage of this from day 1, reducing the size of your bundle and improving rendering times.

## Experimental Features

Experimental features are glimpse into possible features that may be included in NativeWind. These features should be considered experimental, will not follow semver and will not be stable before the release of v4.

These features will work in a limited capacity and you are welcome to test them. As they an active work-in-progress, please do not create bug reports for these features until we announce that we are ready to collect feedback.

#### Animations & Transitions (experimental):

NativeWind add experimental support for Tailwind CSS animation & transition classes. This includes custom key-frame animations defined in CSS.

The animation functionality is provided by the widely-used `react-native-reanimated` package, which integrates seamlessly with NativeWind without the need for additional configuration. Just apply an animation style, and NativeWind takes care of the rest.

When using a transition you must specify all properties that can be transitioned, hence `transition-all`/`transition-property: all;`/`transition: all;` is not supported.

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

// The color will transition over 150ms when the color scheme changes
<Text className="transition-colors text-black dark:text-white" />
```

> There is no need to use `Animated.View` or `Animated.Text`, NativeWind will automatically create animated version of your components.

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

## New Troubleshooting

NativeWind's setup isn't difficult, but it does require multiple plugins to be configured correctly and does not provide a clear troubleshooting guide when mistakes are made. To help with troubleshooting, simply add `import 'nativewind/doctor'` anywhere into your application and it will attempt to diagnose any setup issues.

It verifies

- That the jsx transform is present (invalid jsx setup)
- Styles have been correctly injected (invalid metro setup)
- If custom styles exist (invalid Tailwind setup)

## New API

### `remapClassNameProps`

> `remapClassNameProps` is generally the replacement for `styled()`

In earlier versions, the `styled()` function was utilized to generate new `className` props when a component had multiple `style` props. Now, with NativeWind only converting the `className` on primitive components (e.g., `<View>`), it becomes necessary to communicate to NativeWind that a component is complex and requires appropriate style distribution. The `remapClassNameProps` wrapper serves this purpose.

`remapClassNameProps` accepts a `Component` as the first argument and a mapping as the second. The mapping is in the format `{ [existing prop]: [new prop] | true }`, and it returns a typed version of the component.

An example of how NativeWind binds `<FlatList />` is:

```jsx
remapClassNameProps(FlatList, {
  style: "className",
  ListFooterComponentStyle: "ListFooterComponentClassName",
  ListHeaderComponentStyle: "ListHeaderComponentClassName",
  columnWrapperStyle: "columnWrapperClassName",
  contentContainerStyle: "contentContainerClassName",
  indicatorStyle: "indicatorClassName",
});
```

Following this binding, you can utilize the new props on **`<FlatList />`**:

```jsx
<FlatList className="w-10" ListHeaderComponentClassName="bg-black" />
```

It your render the props of the `<FlatList />` it will looks like this

```jsx
<FlatList style={OpaqueStyleToken() {}} ListHeaderComponentStyle={OpaqueStyleToken() {}} />
```

As you can see `remapClassNameProps` doesn't generate any styles, it simply converts the classNames to a `OpaqueStyleToken`. These tokens are readonly empty objects and should not be modified in any manner. It is not until the token is passed to a component with `enableCSSInterop` is the token converted into a style object.

This makes components using `remapClassNameProps` very performant, as we can avoid creating the NativeWind component wrapper high in your render tree.

For TypeScript users, guides on creating declaration files to type 3rd party components correctly will be available. Alternatively, you can directly use the returned component:

```jsx
jsxCopy code
const StyledComponent = remapClassNameProps(MyComponent, {
  props: {
    style: "className",
    otherStyle: "otherClassName",
  }
});

```

**`enableCSSInterop(component, mapping)`**

`enableCSSInterop` signals to NativeWind that a specific component should be treated as a primitive. On this component, it sets up the dynamic style logic.

Before using `enableCSSInterop` should could consider if `remapClassNameProps` would be more suitable. The main reasons to use `enableCSSInterop` are:

- The component renders a Native Component (e.g `<View />`)
- Moving a style property to an prop
  - Note: If this is not a 3rd party component, you should consider simply using the style prop as this will not work on web.

For reference, NativeWind enable's the CSS interop only for these Core Components, with all others using `remapClassNameProps`:

```jsx
enableCSSInterop(Image, { className: "style" });
enableCSSInterop(Pressable, { className: "style" });
enableCSSInterop(Text, { className: "style" });
enableCSSInterop(View, { className: "style" });
enableCSSInterop(ActivityIndicator, {
  className: {
    target: "style"
    nativeStyleToProp: { color: true }
  }
});
enableCSSInterop(StatusBar, {
  className: {
    target: false
    nativeStyleToProp: { backgroundColor: true }
  }
});
```

An example use case on when to use `enableCSSInterop` is `react-native-svg`, which renders Native Components, needs styles mapped to props and is typically very low in the render tree.

```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Rect from } 'react-native-svg';

enableCSSInterop(Svg, {
  className: {
    target: "style",
    nativeStyleToProp: { width: true, height: true }
  },
});
enableCSSInterop(Circle, {
  className: {
    target: "style",
    nativeStyleToProp: { width: true, height: true, stroke: true, strokeWidth: true, fill: true }
  },
});
enableCSSInterop(Rect, {
  className: {
    target: "style",
    nativeStyleToProp: { width: true, height: true, stroke: true, strokeWidth: true, fill: true }
  },
});

export function SvgExample () {
  return (
    <View className="inset-0 items-center content-center">
      <Svg className="h-1/2 w-1/2" viewBox="0 0 100 100" >
        <Circle cx="50" cy="50" r="45" className="stroke-blue-500 stroke-2 fill-green-500" />
        <Rect x="15" y="15" className="w-16 h-16 stroke-red-500 stroke-2 fill-yellow-500" />
      </Svg>
    </View>
  );
}
```

### `vars()`

TODO

### `useUnstableNativeVariables()`

CSS variables, while highly useful, are largely write-only and cannot be read at runtime. This limitation is due to performance constraints on the web, particularly when attempting to retrieve the current value of a CSS variable for a given subtree.

Web components are conventionally styled using either the className or style attributes, a strategy that makes efficient use of CSS variables. Regrettably, this approach isn't consistently adopted across the native ecosystem.

To provide a solution for native components that need to access a CSS variable’s value, we have useUnstableNativeVariables(). This hook can be more efficient than nativeStyleToProp because it bypasses the need to engage enableCSSInterop on the component.

> It's crucial to avoid using this hook within a web component and restrict its use to .native.js files.

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
