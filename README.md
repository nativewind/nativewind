# tailwindcss-react-native

Use [Tailwindcss](https://tailwindcss.com/) in your cross platform [React Native](https://reactnative.dev/) applications.

* :sparkles: full support for all native RN styles with tailwind counterparts: (view, layout, image, shadow, and text).
* :sparkles: native support for multiple platforms 
* :sparkles: respects tailwind.config.js
* :sparkles: fast refresh compatible
* :sparkles: supports dark mode / media queries / arbitrary classes
* :sparkles: compatible with RN style objects
* :sparkles: Server Side Rendering (SSR) on Web (including responsive styles)

Already using another RN library for Tailwind? [Find out why you should switch.](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/library-comparision.md)

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

### Additional steps if using typescript

Create a file (eg. `src/tailwindcss-react-native.d.ts`) and paste this line

```
import "tailwindcss-react-native/types.d"
```

## Usage

Simply add a `className` attribute to your existing `react-native` components

```jsx
<Text className="font-bold">
```

You can combine it with existing styles

```jsx
<Text className="font-bold" style={styles.text}>
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
platform | `native`, `web`, `native-inline`, `native-context` | `native` | Specifies how the className is transformed (see [platforms](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/platforms.md) 
tailwindConfig | Path relative to `cwd` | `tailwind.config.js` | Provide a custom `tailwind.config.js`. Useful for setting different settings per platform.


## How it works

Under the hood, `tailwindcss-react-native` performs these general steps

1. Use `postcss` to compile the classes using `tailwindcss` and other plugins
1. Convert the CSS styles to the platform specific styles (eg using `StyleSheet.create` for native)
1. Remove the `className` attribute and replace/merge it with the `style` attribute
1. Utilises a `react` hook for matching media queries.

 See [the platforms documentation](https://github.com/marklawlor/tailwindcss-react-native/blob/main/docs/platforms.md) for a more detailed explaination)
