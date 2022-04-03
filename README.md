# tailwindcss-react-native

Use [Tailwindcss](https://tailwindcss.com/) in your cross platform [React Native](https://reactnative.dev/) applications.

* :sparkles: full support for all native RN styles with tailwind counterparts: (view, layout, image, shadow, and text).
* :sparkles: native support for multiple platforms 
* :sparkles: respects tailwind.config.js
* :sparkles: fast hot-reload
* :sparkles: supports dark mode / media queries / arbitrary classes
* :sparkles: platform prefixes: android:mt-4 ios:mt-2 web:mt-3
* :sparkles: compatible with RN style objects
* :sparkles: Server Side Rendering (SSR) on Web (including responsive styles)

## Why?

* Readable: All classes follow the same convention
* Themeable: Use a consistent them across your applications
* Reusable: Share components between applications

Already using another RN library for Tailwind? [Find out why you should switch.](./docs/library-comparision.md)

## Install

`npm install tailwindcss-react-native` or `yarn add tailwindcss-react-native`

Add `tailwindcss-react-native/babel` to your babel plugins 

```js
// babel.config.js
module.exports = {
  plugins: [
    'tailwindcss-react-native/babel'
  ],
}
```
Add the `TailwindProvider` to your application

```jsx
import { TailwindProvider } from 'tailwindcss-react-native`

function MyAppsProviders ({ children }) {
    return (
        <TailwindProvider>{children}</TailwindProvider>
    )
}
```

### Additional steps if targeting `web`

When targetting the web platform, you will need to include the `tailwindcss-react-native/plugin` tailwind plugin.

```js
// tailwind.config.js
module.exports = {
  plugins: [
    ['tailwindcss-react-native/plugin']
  ],
}
```

## Usage

Simply add a `className` attribute to your existing `react-native` components

```jsx
<Text className="font-bold">
```

You can combine it with existing styles

```jsx
<Text className="font-bold" style={styles.text}>

const styles = StyleSheet.create({ text: { color: 'blue' }})
```



## Options

Options can be provided via the babel config

```js
// babel.config.js
module.exports = {
  plugins: [
    ['tailwindcss-react-native', { platform: 'native' }]
  ],
}
```

Pro      | Values               | Default  | Description         
---------|----------------------|----------|----------------------
platform | `native`, `web`, `native-inline`, `native-context` | `native` | Specifies how the className is transformed (see [platforms](#platforms) 
tailwindConfig | Path relative to `cwd` | `tailwind.config.js` | Provide a custom `tailwind.config.js`. Useful for setting different breakpoints per platform.


## How it works

Under the hood, `tailwindcss-react-native` performs these general steps (see [platforms](#platforms) for a more detailed explaination)

1. Use `postcss` to compile the classes using `tailwindcss` and other plugins
1. Convert the CSS styles to the platform specific styles (eg using `StyleSheet.create` for native)
1. Remove the `className` attribute and replace/merge it with the `style` attribute
1. Utilises a `react` hook for matching media queries.

## Platforms

### native

The `native` platform switches platform based upon the `NODE_ENV` environment variable. It uses `native-context` when `NODE_ENV === production` otherwise it defaults to `native-inline`

### native-context

The platform best suited for production environments. It compiles the entire applications styles and produces the smallest possible output. It shares these styles to components via a React context.

Feature | Included
------ | -------------
Small output | :heavy_check_mark: 
Hot module reload | :x: 
Requires external tooling | :x: 


```diff
- import { Text } from "react-native"
+ import { Text, StyleSheet } from "react-native"
- import { TailwindProvider } from "tailwindcss-react-native"
+ import { TailwindProvider, __tailwindMedia } from "tailwindcss-react-native"

export function Test() {
  return (
-   <TailwindProvider>
+   <TailwindProvider styles={__tailwindStyles} media={__tailwindMedia}>
-     <Text className="font-bold">Test</Text>
+     <Text style={__useParseTailwind("font-bold")}>Test</Text>
    </TailwindProvider>
  )
}

+ const __tailwindStyles = StyleSheet.create({ 'font-bold': { fontWeight: "700" }})
+ const __tailwindMedia = {}
```

### native-inline

The platform best suited for development environments. Produces larger output but works with hot-reload. Each file will generate it's own styles and provide them inline.

Feature | Included
------ | -------------
Small output | :x: 
Hot module reload | :heavy_check_mark: 
Requires external tooling | :x: 

```diff
- import { Text } from "react-native"
+ import { Text, StyleSheet } from "react-native"
+ import {  __tailwindMedia } from "tailwindcss-react-native"

export function Test() {
  return (
-   <Text className="font-bold">Test</Text>
+   <Text style={__useParseTailwind("font-bold", { styles: __tailwindStyles, media: __tailwindMedia})}>Test</Text>
  )
}

+ const __tailwindStyles = StyleSheet.create({ 'font-bold': { fontWeight: "700" }})
+ const __tailwindMedia = {}
```

### web

| `web` requires `react-native-web@0.18+` (currently in preview). Please see this [PR](https://github.com/necolas/react-native-web/pull/2248) for more info. If your are currently using `<=0.17` you can still use `native` for rendering within a browser.

The platform to use when using `react-native-web`. It leaves the className attribute as-is, allowing you to use CSS files for your styling. Because of this, you will need to follow the [TailwindCSS installation steps](https://tailwindcss.com/docs/installation) to include the nessessary `.css` files in your HTML.

Relies on external tooling for production minification.

Feature | Included
------ | -------------
Small output | :heavy_check_mark: 
Hot module reload | :heavy_check_mark: 
Requires external tooling | :heavy_check_mark: 

```diff
import { Text } from "react-native"

export function Test() {
  return (
-   <Text className="font-bold">Test</Text>
+   <Text style={__tailwindStyles}>Test</Text>
  )
}

+ const __tailwindStyles = { 'font-bold': { $$css: true, tailwind: 'font-bold' }}
```

##
