# Theme

NativeWind uses the same theme values as as Tailwind CSS. You can read more about how to configure your project [through the Tailwind CSS documentation](https://tailwindcss.com/docs/theme)

## Per platform theme values

NativeWind exposes a function `platformSelect` that allows you to provide platform specific theme values.

```js
// tailwind.config.js

const { platformValue } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      colors: {
        error: platformSelect({
          // Now you can provide platform specific values
          ios: "platformColor(systemRed)",
          android: "platformColor(?android:colorError)",
          default: "red",
        }),
      },
    },
  },
});
```

## Per device theme values

React Native provides a number of utilities for creating styles based upon the devices pixel ratio. These include the [PixelRatio](https://reactnative.dev/docs/pixelratio) helpers and [StyleSheet.hairlineWidth](https://reactnative.dev/docs/stylesheet#hairlinewidth)

| Function                              | React Native equivalent                |
| ------------------------------------- | -------------------------------------- |
| `hairlineWidth()`                     | `StyleSheet.hairlinewidth`             |
| `roundToNearestPixel(<number>)`       | `PixelRatio.roundToNearestPixel`       |
| `getPixelSizeForLayoutSize(<number>)` | `PixelRatio.getPixelSizeForLayoutSize` |
| `pixelMultipler(<number>)`            | `PixelRatio.get() * <value>`           |
| `fontScaleMultipler(<number>)`        | `PixelRatio.getFontScale() * <value>`  |

### Scaling functions

`PixelRatio.get()` and `PixelRatio.getFontScale()` are often used for non-linear scaling. As such you can explicity provide the values as scale/value pairs. If no `default` key is set and no matching scale is found it will return 0.

| Function                                     |
| -------------------------------------------- |
| `pixel(<scale>:<value> default:<value>)`     |
| `fontScale(<scale>:<value> default:<value>)` |

:::note

There are no quotes between the brackets in theme functions

:::

## Combining theme functions

Theme functions can be combined to create complex theme values

```js
const myFontSize = `roundToNearestPixel(fontScaleMultipler(16))`;

// compiles to

PixelRatio.roundToNearestPixel(PixelRatio.getFontScale() * 16);
```
