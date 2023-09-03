# Quirks

NativeWind aligns CSS and React Native into a common language. However the two style engines do have their differences. We refer to these differences as quirks.

## Explicit styles

React Native has various issues when conditionally applying styles. To prevent these issues it's best to declare all styles.

For example, instead of only applying a text color for dark mode, provide both a light and dark mode text color.

## dp vs px

React Native's default unit is density-independent pixels (dp) while the web's default is pixels (px). These two units are different, however NativeWind treats them as if they are equivalent. This can cause confusion in your theme, do you use `10` or `10px`? The general rule of theme is use `10px`, and NativeWind will fix it for you.

## Flex

React Native uses a different base flex definition to the web. This can be fixed by adding `flex-1` to your classes which fixes most issues. If other cases, you can use platform selectors to selectively fix platform.

## Flex Direction

React Native uses a different default `flex-direction` to the web. This can be fixed by explicitly setting a `flex-direction`
