# tailwindcss-react-native

Use [Tailwindcss](https://tailwindcss.com/) in your cross platform [React Native](https://reactnative.dev/) applications.

> This library is currently stabilising for a v1 release.
>
> Follow the [v1 milestone](https://github.com/marklawlor/tailwindcss-react-native/milestone/1) to track the progress.

<img src="https://raw.github.com/marklawlor/tailwindcss-react-native/next/docs/example.svg">

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
````

## Additional setup

This library can be used with or without babel. The babel plugin provides a better developer experience, improved fast-refresh and quicker setup, but is unsuitable for using within a published library or for frameworks not using babel.

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
  Without babel, the tailwindcss styles will need to be compiled via the `tailwindcss-react-native` command-line tool. This tool wraps the `tailwindcss` CLI and writes a `tailwindcss-react-native-output.js` which will need to be imported into your application.

  How your run `tailwindcss-react-native` is up to you, but we recommend using [`concurrently`](https://www.npmjs.com/package/concurrently) to run the process in parallel (eg. `"start": "concurrently \"tailwindcss-react-native native --platform native --watch\" \"expo start\""`)

  The babel plugin will covert components with a `className` attribute into a `StyledComponent`. Please see [Babel Options](#babel-options) to configure the transform.

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

  You will not be able to use the `className` attribute on RN components, and will need to use the [Component API](#component-api)

  ```JSX
  // Example usage of the Component API
  import { Text } from "react-native"
  import { styled } from "tailwindcss-react-native"

  const StyledText = styled(Text)

  export function MyComponent() {
    return <StyledText className="font-bold">Hello world</StyledText>
  }
  ```
  <hr />
</details>

#### Web only

> The platform `web` requires `react-native-web@0.18+` (currently in preview). Please see this [PR](https://github.com/necolas/react-native-web/pull/2248) for more info. If your are currently using `<=0.17` you can still use `native` for rendering within a browser.

If using `{ platform: 'web' }` you will need to follow the follow the [TailwindCSS installation steps](https://tailwindcss.com/docs/installation) to include it's styles in your application.

## Usage

Simply add a `className` attribute to your existing `react-native` components

```JSX
<Text className="font-bold">
```

## useTailwind

Sometimes components have multiple style props, or you need programmatic access to the generated styles. In these instances you can use the `useTailwind` hook.

```
import { MotiView } from "moti";
import { useTailwind } from "tailwindcss-react-native";

export function MyComponent() {
  return (
    <MotiView
      from={useTailwind('opacity-0')}
      animate={useTailwind('opacity-1')}
      exit={useTailwind('opacity-0')}
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

| Option         | Values                 | Default                                       | Description                                                                                                                                                |
| -------------- | ---------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| platform       | `native`, `web`        | `native`                                      | Specifies how the className is transformed (see [platforms](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/platforms.md)<br/><br /> |
| hmr            | boolean                | Development: `true` <br />Production: `false` | Allow fast-refresh of styles                                                                                                                               |
| tailwindConfig | Path relative to `cwd` | `tailwind.config.js`                          | Provide a custom `tailwind.config.js`. Useful for setting different settings per platform.                                                                 |
| allow          | `*`, string[]          | `*`                                           | Only transform components from these imported modules. `*` will transform all modules                                                                      |
| block          | string[]               | []                                            | Do not transform components from these imported modules.                                                                                                   |

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

The `className` prop is removed and added/created into the `style` prop.
