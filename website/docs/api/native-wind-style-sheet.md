# NativeWindStyleSheet

A StyleSheet is an abstraction similar to CSS StyleSheets and React Native's StyleSheet.

## Methods

### setPlatform(platform: Platform.OS)

Override the platform used by the platform prefixes. Defaults to Platform.OS

### setCss(boolean)

Override if the StyleSheet should use setCss or native styles. Defaults to `true` if Platform.OS === `web` && React Native Web >0.18.

### setDimensions(dimensions: Dimensions)

Override how window dimensions are calculated. Defaults to Dimensions from React Native.

### setAppearance(appearance: Appearance)

Override the app's appearance. Defaults to Appearance from React Native.
