# Quirks

While NativeWind is stable, its developers still consider it a work-in-progress and as such it has some small quirks.

We are open to community assistance in helping us resolving these issues.

## Explicit styles

React Native has various issues when conditionally applying styles. To prevent these issues it's best to declare all styles.

For example, instead of only apply a text color for dark mode, provide both a light and dark mode text color.

## Dp vs px

React Native's default unit is device-independent pixels (dp) while the web's default is pixels (px). These two units are different, however NativeWind treats them as if they are equalivant. Additionally, the NativeWind's compiler requires a unit for most numeric values forcing some styles to use a `px` unit.

## Flex

React Native uses a different base flex definition to the web. This can be fixed by adding `flex-1` to your classes, which forces the platforms to align.

## Flex Direction

React Native uses a different default `flex-direction` to the web. This can be fixed by explicity setting a `flex-direction`
