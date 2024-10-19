# Theme

NativeWind uses the same theme values as as Tailwind CSS. You can read more about how to configure your project [through the Tailwind CSS documentation](https://tailwindcss.com/docs/theme)

## Per platform theme values

NativeWind exposes a function `platformSelect` that allows you to provide platform specific theme values.

platformSelect is the equivalent to `Platform.select()`

```js
// tailwind.config.js

const { platformSelect } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      colors: {
        error: platformSelect({
          // Now you can provide platform specific values
          ios: "red"
          android: "blue"
          default: "green",
        }),
      },
    },
  },
};
```

## Per device theme values

React Native provides a number of utilities for creating styles based upon physical attributes of the device. These include the [PixelRatio](https://reactnative.dev/docs/pixelratio) helpers and [StyleSheet.hairlineWidth](https://reactnative.dev/docs/stylesheet#hairlinewidth)

NativeWind supports these through a set of exported helper functions that you can use in your `tailwind.config.js`

### platformColor()

Equivalent of `PlatformColor`

```js
// tailwind.config.js

const { platformColor } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      colors: {
        platformRed: platformColor("systemRed", "red"),
      },
    },
  },
};
```

### hairlineWidth()

Equivalent of `StyleSheet.hairlineWidth`

```js
// tailwind.config.js

const { hairlineWidth } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
      },
    },
  },
};
```

### pixelRatio()

Equivalent of `PixelRatio.get()`

If a number is provided it returns `PixelRatio.get() * <value>`

Otherwise it can accept an object and returns `object[PixelRatio.get()] ?? PixelRatio.get()`

```js
// tailwind.config.js

const { pixelRatio } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      borderWidth: {
        number: pixelRatio(2)
        object: pixelRatio({
          1: 1
          1.5: 2
          2: 4
        })
      },
    },
  },
};
```

### fontScale()

Equivalent of `PixelRatio.getFontScale()`

If a number is provided it returns `PixelRatio.getFontScale() * <value>`

Otherwise it can accept an object and returns `object[PixelRatio.getFontScale()] ?? PixelRatio.getFontScale()`

```js
// tailwind.config.js

const { getFontScale } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      fontSize: {
        number: fontScale(2)
        object: fontScale({
          1: 10
          1.5: 15
          2: 20
        })
      },
    },
  },
};
```

### getPixelSizeForLayoutSize()

Equivalent of `PixelRatio.getPixelSizeForLayoutSize()`

```js
// tailwind.config.js

const { getPixelSizeForLayoutSize } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      size: {
        custom: getPixelSizeForLayoutSize(2),
      },
    },
  },
};
```

### roundToNearestPixel()

Equivalent of `PixelRatio.roundToNearestPixel()`

```js
// tailwind.config.js

const { roundToNearestPixel } = require("nativewind");

module.exports = {
  theme: {
    extend: {
      size: {
        custom: roundToNearestPixel(8.4)
      },
    },
  },
});
```
