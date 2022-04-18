# tailwindcss-react-native

Use [Tailwindcss](https://tailwindcss.com/) in your cross platform [React Native](https://reactnative.dev/) applications.

> This library is currently stabilising for a v1 release.
>
> Follow the [v1 milestone](https://github.com/marklawlor/tailwindcss-react-native/milestone/1) to track the progress.

```JSX
import { Text } from "react-native"
import { TailwindProvider } from "tailwindcss-react-native"

export function Test({ isBold }) {
  return (
    <TailwindProvider>
     <Text className="font-bold">Basic usuage</Text>
     <Text className={isBold ? "font-bold" : ""}>You can use compueted styles</Text>
     <Text className="font-bold" style={{ color: 'green' }}>Works with existing styles</Text>
    </TailwindProvider>
  )
}
```

- **native support** for multiple platforms (RN Stylesheets, CSS Stylesheets)
- fast refresh compatible
- respects **all** tailwind.config.js, including themes, custom values, plugins
- supports **dark mode** / **media queries** / **arbitrary classes**
- compatible with existing styles
- supports Server Side Rendering (SSR) on Web (including responsive styles)

Already using another RN library for Tailwind? [Find out why you should switch.](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/library-comparision.md)

## Getting started

Install the library

`npm install tailwindcss-react-native tailwindcss` or `yarn add tailwindcss-react-native tailwindcss`

Add `tailwindcss-react-native/babel` to your babel plugins

```js
// babel.config.js
module.exports = {
  plugins: ["tailwindcss-react-native/babel"],
};
```

Add the `TailwindProvider` to your application

```JSX
import { TailwindProvider } from 'tailwindcss-react-native'

function MyAppsProviders ({ children }) {
    return (
        <TailwindProvider>{children}</TailwindProvider>
    )
}
```

Create a `tailwind.config.js` and set `content`

> During development your application may work without a `tailwind.config.js` or the `content` option, but it will error when running in production.

```
// tailwind.config.js
module.exports = {
  content: [
    './screens/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  // ...
}
```

#### tailwindcss peerDependency

This package has a peerDependency of `tailwindcss@3.x.x`. You can install it with `npm install tailwindcss` or `yarn add tailwindcss`

#### Typescript support

Create a file (eg. `src/tailwindcss-react-native.d.ts`) and paste this line

```js
import "tailwindcss-react-native/types.d";
```

#### Web only

> The platform `web` requires `react-native-web@0.18+` (currently in preview). Please see this [PR](https://github.com/necolas/react-native-web/pull/2248) for more info. If your are currently using `<=0.17` you can still use `native` for rendering within a browser.

If using `{ platform: 'web' }` you will need to follow the follow the [TailwindCSS installation steps](https://tailwindcss.com/docs/installation) to include it's styles in the application.

## How it works

Under the hood, `tailwindcss-react-native` performs these general steps

1. Use `postcss` to compile the classes using `tailwindcss` and other plugins
1. Convert the CSS styles to the platform specific styles (eg using `StyleSheet.create` for native)
1. Remove the `className` attribute and replace/merge it with the `style` attribute
1. Replace the className string with a `react` hook to load styles and match media queries.

For detailed explaination see [the platforms documentation](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/platforms.md) for a more detailed explaination)

## Usage

Simply add a `className` attribute to your existing `react-native` components

```JSX
<Text className="font-bold">
```

You can combine it with existing styles

```JSX
<Text className="font-bold" style={styles.text}>
```

Or perform computed logic

```JSX
export function Test({ isBold, isUnderline }) {
  const classNames = [];

  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");

  return (
    <Text className={classNames.join(" ")}>Hello world!</Text>
  );
}
```

## Options

Options can be provided via the babel config

```js
// babel.config.js
module.exports = {
  plugins: [["tailwindcss-react-native/babel", { platform: "native" }]],
};
```

| Option         | Values                 | Default              | Description                                                                                                                                                                                                                    |
| -------------- | ---------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| platform       | `native`, `web`        | `native`             | Specifies how the className is transformed (see [platforms](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/platforms.md)<br/><br />You can also use `native-inline`, `native-context` to debug `native` |
| tailwindConfig | Path relative to `cwd` | `tailwind.config.js` | Provide a custom `tailwind.config.js`. Useful for setting different settings per platform.                                                                                                                                     |
| allowModules   | `*`, string[]          | `*`                  | Only transform components from these imported modules. `*` will transform all modules                                                                                                                                          |
| blockModules   | string[]               | []                   | Do not transform components from these imported modules.                                                                                                                                                                       |

## Troubleshooting

### Components are not being transformed

Make sure your `tailwind.config.js` content configuration is correct and matches all of the right source files.

A common mistake is missing a file extension, for example if you’re using jsx instead of js for your React components:

````diff
module.exports = {
  content: [
-   './src/**/*.{html,js}',
+   './src/**/*.{html,js,jsx}'
  ],
  // ...
}
```

Or creating a new folder mid-project that wasn’t covered originally and forgetting to add it to your configuration:

```diff
module.exports = {
  content: [
    './pages/**/*.{html,js}',
    './components/**/*.{html,js}',
+    './util/**/*.{html,js}'
  ],
  // ...
}
````

### Don't construct class names dynamically

The TailwindCSS compiler [does not allow for dynamic class names](https://tailwindcss.com/docs/content-configuration#dynamic-class-names). Use this pattern instead

```diff
- <div class="text-{{ error ? 'red' : 'green' }}-600"></div>
+ <div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

### Don’t use `className` inside loops

`tailwindcss-react-native` is using a hook to load the styles and match media queries. For this reason, all components with a `className` attribute must follow the rules of hooks.

```diff
- export function Test() {
-  return [1,2,3].map((i) => <Text key={i} className="font-bold">Test</Text>
-}

+ export function Test() {
+  return [1,2,3].map((i) => <StyledText key={i}>Test</Text>
+ }

+ function StyledText(props) {
+   return <Text className="font-bold" {...props} />
+ }
```

### Don’t use `className` conditionally

The value of `className` can be conditional, but not the attribute itself!

```diff
- export function Test({ isBold }) {
-   if (isBold) {
-     return <Text className="font-bold">Test</Text>
-   } else {
-     return <Text>Test</Text>
-   }
- }

+ export function Test({ isBold }) {
+   return <Text className={isBold ? "font-bold" : ""}>Test</Text>
+ }
```
