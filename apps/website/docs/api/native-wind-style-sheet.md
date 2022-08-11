# NativeWindStyleSheet

A StyleSheet is an abstraction similar to CSS StyleSheets and React Native's StyleSheet.

## Methods

### setOutput(specifics)

Set the style output per Platform

```js
NativeWindStyleSheet.setOutput({
  web: 'css',
  default: 'native'
})
```

### setDimensions(dimensions: Dimensions)

Override how window dimensions are calculated. Defaults to Dimensions from React Native.

### setAppearance(appearance: Appearance)

Override the app's appearance. Defaults to Appearance from React Native.

### setColorScheme(colorScheme: 'light' | 'dark' | 'system')

Set the applications color scheme
