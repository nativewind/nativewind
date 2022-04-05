# tailwindcss-react-native

Use [Tailwindcss](https://tailwindcss.com/) in your cross platform [React Native](https://reactnative.dev/) applications.

> This library is currently under active development.

* :sparkles: native support for multiple platforms 
* :sparkles: respects tailwind.config.js
* :sparkles: fast refresh compatible
* :sparkles: supports dark mode / media queries / arbitrary classes
* :sparkles: compatible with existing styles
* :sparkles: Server Side Rendering (SSR) on Web (including responsive styles)

Already using another RN library for Tailwind? [Find out why you should switch.](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/library-comparision.md)

## Getting started

Install the library

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

```JSX
import { TailwindProvider } from 'tailwindcss-react-native'

function MyAppsProviders ({ children }) {
    return (
        <TailwindProvider>{children}</TailwindProvider>
    )
}
```

#### tailwindcss

This package has a peerDependency of `tailwindcss@3.x.x`. You can install it with `npm install tailwindcss` or `yarn add tailwindcss`

#### typescript

Create a file (eg. `src/tailwindcss-react-native.d.ts`) and paste this line

```js
import "tailwindcss-react-native/types.d"
```

#### Web only

> `web` requires `react-native-web@0.18+` (currently in preview). Please see this [PR](https://github.com/necolas/react-native-web/pull/2248) for more info. If your are currently using `<=0.17` you can still use `native` for rendering within a browser.

If using `{ platform: 'web' }` you will need to follow the follow the [TailwindCSS installation steps](https://tailwindcss.com/docs/installation) to include it's styles in the application.



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
  plugins: [
    ['tailwindcss-react-native', { platform: 'native' }]
  ],
}
```

Prop      | Values               | Default  | Description         
----------|----------------------|----------|----------------------
platform | `native`, `web`, `native-inline`, `native-context` | `native` | Specifies how the className is transformed (see [platforms](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/platforms.md) 
tailwindConfig | Path relative to `cwd` | `tailwind.config.js` | Provide a custom `tailwind.config.js`. Useful for setting different settings per platform.


## How it works

Under the hood, `tailwindcss-react-native` performs these general steps

1. Use `postcss` to compile the classes using `tailwindcss` and other plugins
1. Convert the CSS styles to the platform specific styles (eg using `StyleSheet.create` for native)
1. Remove the `className` attribute and replace/merge it with the `style` attribute
1. Utilises a `react` hook for matching media queries.

 See [the platforms documentation](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/platforms.md) for a more detailed explaination)
