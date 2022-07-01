# Theme

NativeWind uses the same theme values as as Tailwind CSS. You can read more about how to configure your project [through the Tailwind CSS documentation](https://tailwindcss.com/docs/theme)

## Per platform theme values

NativeWind exposes a function `withPlatformTheme` that can wrap your Tailwind configuration to provide platform specific theme values.

```js
// tailwind.config.js

const { withPlatformTheme } = require("nativewind");

module.exports = withPlatformTheme({
  theme: {
    extend: {
      colors: {
        error: {
          // Now you can provide platform specific values
          ios: "platformColor(systemRed)",
          android: "platformColor(?android:colorError)",
          DEFAULT: "red",
        },
      },
    },
  },
});
```

### Manual style compilation

:::note

This is only for fringe setups where you are manually compiling and injecting your NativeWind styles.

:::

When manually compiling and injecting your styles, you will need to set the environment variable `NATIVEWIND_PLATFORM_THEME=1` before hand, otherwise `withPlatformTheme` will simply return the `DEFAULT` value.

## Per device theme values

React Native provides a number of utilities for creating styles based upon the devices pixel ratio. These include the [PixelRatio](https://reactnative.dev/docs/pixelratio) helpers and [StyleSheet.hairlineWidth](https://reactnative.dev/docs/stylesheet#hairlinewidth)

| Function                              | React Native equivalent                |
| ------------------------------------- | -------------------------------------- |
| `hairlineWidth()`                     | `StyleSheet.hairlinewidth`             |
| `round()`                             | `Math.round`                           |
| `roundToNearestPixel(<number>)`       | `PixelRatio.roundToNearestPixel`       |
| `getPixelSizeForLayoutSize(<number>)` | `PixelRatio.getPixelSizeForLayoutSize` |
| `pixelMultipler(<number>)`            | `PixelRatio.get() * <value>`           |
| `fontScaleMultipler(<number>)`        | `PixelRatio.getFontScale() * <value>`  |

### Scaling functions

`PixelRatio.get()` and `PixelRatio.getFontScale()` are often used for non-linear scaling. As such you can explicity provide the values as scale/value pairs. If no DEFAULT key is set and no matching scale is found it will return 0.

| Function                                     |
| -------------------------------------------- |
| `pixel(<scale>:<value> DEFAULT:<value>)`     |
| `fontScale(<scale>:<value> DEFAULT:<value>)` |

:::note

There are no quotes between the brackets in theme functions

:::

## Combining theme functions

Theme functions can be combined to create complex theme values

```js
const myFontSize = 16`roundToNearestPixel(fontScaleMultipler(${myFontSize}))`;

// compiles to

PixelRatio.roundToNearestPixel(PixelRatio.getFontScale() * 16);
```
