# tailwindcss-react-native

<img src="https://raw.github.com/marklawlor/tailwindcss-react-native/main/docs/example.svg">

Use [Tailwindcss](https://tailwindcss.com/) in your cross platform [React Native](https://reactnative.dev/) applications.

- **native support** for multiple platforms (uses RN Stylesheets for native, CSS Stylesheets for web)
- **fast refresh** compatible
- respects **all** tailwind.config.js, including themes, custom values, plugins
- supports **dark mode** / **arbitrary classes** / **media queries**
- supports **responsive** Server Side Rendering (SSR) on Web

Already using another RN library for Tailwind? [Find out why you should switch.](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/library-comparision.md)

## Getting started

Install the library

`npm install tailwindcss-react-native tailwindcss` or `yarn add tailwindcss-react-native tailwindcss`

Create a `tailwind.config.js` and set `content`

```js
// tailwind.config.js
module.exports = {
  content: [
    "./screens/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
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

#### tailwindcss peerDependency

This package has a peerDependency of `tailwindcss@3.x.x`. You can install it with `npm install tailwindcss` or `yarn add tailwindcss`

#### Typescript support

Create a file (eg. `src/tailwindcss-react-native.d.ts`) and paste this line

```js
import "tailwindcss-react-native/types.d";
```

## Additional setup

This library can be used with or without babel. The babel plugin provide DexUX features such as:

- Automatically wrap components in `StyledComponent`
- Automatically inject Tailwindcss styles

If you do not wish to use babel, or are using using a non-babel web framework (such as [Next.js](https://nextjs.org/docs/advanced-features/compiler)), you will need to manually wrap native components via the [Component Api](#component-api).

<details>
  <summary>With babel</summary>
  <hr />
  Add `tailwindcss-react-native/babel` to your babel plugins

```js
// babel.config.js
module.exports = {
  plugins: ["tailwindcss-react-native/babel"],
};
```

The babel plugin will covert components with a `className` attribute into a `StyledComponent`. Please see [Babel Options](#babel-options) to configure the transform.

  <hr />
</details>

<details>
  <summary>Without babel</summary>
  <hr />

### Component API

Without babel, you will need to manually wrap your native components via the [Component API](#component-api)

```JSX
// Example usage of the Component API
import { Text } from "react-native"
import { styled } from "tailwindcss-react-native"

const StyledText = styled(Text)

export function MyComponent() {
  return <StyledText className="font-bold">Hello world</StyledText>
}
```

### Web frameworks with Tailwindcss Support

> The platform `web` requires `react-native-web@0.18+` (currently in preview). Please see this [PR](https://github.com/necolas/react-native-web/pull/2248) for more info. If your are currently using `<=0.17` you can still use `native` for rendering within a browser.

If you are using a web framework with [first-class Tailwindcss support](https://tailwindcss.com/docs/installation/framework-guides) you can follow the framework setup guide and simply add the `TailwindProvider` with the `platform="web"` attribute.

```JSX
import { TailwindProvider } from 'tailwindcss-react-native'

function MyAppsProviders ({ children }) {
    return (
       <TailwindProvider platform="web">{children}</TailwindProvider>
    )
}
```

### Native

The tailwindcss styles will need to be compiled via the `tailwindcss-react-native` command-line tool. This tool wraps the `tailwindcss` CLI and outputs a file which will need to be manually imported into your application.

There are many ways to run `tailwindcss-react-native`, but we recommend using [`concurrently`](https://www.npmjs.com/package/concurrently) to run the process in parallel with your normal startup command (eg. `"start": "concurrently \"tailwindcss-react-native --platform native --watch\" \"expo start\""`).

Please see [CLI Options](#cli-options) for usuage of the CLI.

Once you have the generated file, you will need to update your `TailwindProvider`

```diff
import { TailwindProvider } from 'tailwindcss-react-native'
+ import * as tailwindProviderProps from "./tailwindcss-react-native-output"

function MyAppsProviders ({ children }) {
    return (
-       <TailwindProvider>{children}</TailwindProvider>
+       <TailwindProvider {...tailwindProviderProps}>{children}</TailwindProvider>
    )
}
```

  <hr />
</details>

#### Web only

> The platform `web` requires `react-native-web@0.18+` (currently in preview). Please see this [PR](https://github.com/necolas/react-native-web/pull/2248) for more info. If your are currently using `<=0.17` you can still use `native` for rendering within a browser.

If using `{ platform: 'web' }` you will need to follow the follow the [TailwindCSS installation steps](https://tailwindcss.com/docs/installation) to include it's styles in your application.

## Usage

### With Babel

Simply add a `className` attribute to your components

```JSX
<Text className="font-bold">
```

### useTailwind

Sometimes components have multiple style props, or you need programmatic access to the generated styles. In these instances you can use the `useTailwind` hook.

```JSX
import { MotiView } from "moti";
import { useTailwind } from "tailwindcss-react-native";

export function MyComponent() {
  const opacity0 = useTailwind('opacity-0')
  const opacity1 = useTailwind('opacity-1')

  return (
    <MotiView
      from={opacity0}
      animate={opacity1}
      exit={opacity0}
    />
  );
}

```

## Component API

If you are not using the babel plugin you will need to use the Component API.

### styled

`styled` is a [Higher-Order Component](https://reactjs.org/docs/higher-order-components.html) which transforms the component into a `tailwindcss-react-native` compatible component.

A component created via `styled` will now accept the `className` prop. It will recieve the compiled styles via the `style` prop.

```JSX
import { Text } from "react-native"
import { styled } from "tailwindcss-react-native"

const StyledText = styled(Text)

export function MyComponent() {
  return <StyledText className="font-bold">Hello world</StyledText>
}
```

### StyledComponent

`StyledComponent` is the component version of `styled`. It is a normal component that accepts your component as a prop.

`StyledComponent` will pass all props to your component, except for `className` which it will convert into the `style` prop.

```JSX
import { Text } from "react-native"
import { StyledComponent } from "tailwindcss-react-native"

export function MyComponent() {
  return <StyledComponent component={Text} className="font-bold">Hello world</StyledComponent>
}
```

## Options

### Babel Options

Options can be provided via the babel config

```js
// babel.config.js
module.exports = {
  plugins: [["tailwindcss-react-native/babel", { platform: "native" }]],
};
```

| Option         | Values                 | Default                                       | Description                                                                                |
| -------------- | ---------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| platform       | `native`, `web`        | `native`                                      | Specifies how the className is transformed                                                 |
| hmr            | `boolean`              | Development: `true` <br />Production: `false` | Allow fast-refresh of styles                                                               |
| tailwindConfig | Path relative to `cwd` | `tailwind.config.js`                          | Provide a custom `tailwind.config.js`. Useful for setting different settings per platform. |
| allowModules   | `*`, `string[]`        | `*`                                           | Only transform components from these imported modules. `*` will transform all modules      |
| blockModules   | `string[]`             | `[]`                                          | Do not transform components from these imported modules.                                   |

### CLI Options

Usage `tailwindcss-react-native [...options]`

```
Options:
      --help      Show help                                             [boolean]
      --version   Show version number                                   [boolean]
  -p, --platform  tailwindcss-react-native platform                    [required]
  -c, --config    Path to tailwindcss config file [default: "tailwind.config.js"]
  -o, --output    Output file     [default: "tailwindcss-react-native-output.js"]
  -w, --watch     Watch for changes and rebuild as needed        [default: false]
```

## Troubleshooting

### Components are not being transformed

Make sure your `tailwind.config.js` content configuration is correct and matches all of the right source files.

A common mistake is missing a file extension, for example if you’re using jsx instead of js for your React components:

```diff
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
```

### Don't construct class names dynamically

The TailwindCSS compiler [does not allow for dynamic class names](https://tailwindcss.com/docs/content-configuration#dynamic-class-names). Use this pattern instead

```diff
- <div class="text-{{ error ? 'red' : 'green' }}-600"></div>
+ <div class="{{ error ? 'text-red-600' : 'text-green-600' }}"></div>
```

### className is not passed to child components

The `className` prop is not passed to the wrapped components, it is transformed into a style object and passed via the `style` prop.
