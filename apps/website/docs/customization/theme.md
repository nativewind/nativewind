# Theme

NativeWind uses the same theme values as as Tailwind CSS. You can read more about how to configure your project [through the Tailwind CSS documentation](https://tailwindcss.com/docs/theme).

Fully dynamic React Native applications often make use of helper functions such as `Platform.select` and `PixelRatio`. NativeWind exports helpers allowing you to embed these functions into your theme.

## platformSelect

platformSelect is the equivalent to (`Platform.select()`)[https://reactnative.dev/docs/platform#select]

```js
// tailwind.config.js

const { platformSelect } = require("nativewind/theme");

module.exports = {
  theme: {
    extend: {
      colors: {
        error: platformSelect({
          ios: "red",
          android: "blue",
          default: "green",
        }),
      },
    },
  },
};
```

### platformColor()

Equivalent of (`PlatformColor`)[https://reactnative.dev/docs/platformcolor]. Typically used with `platformSelect`.

```ts title=tailwind.config.js
const { platformColor } = require("nativewind/theme");

module.exports = {
  theme: {
    extend: {
      colors: {
        platformRed: platformSelect({
          android: platformColor("systemRed"),
          web: "red",
        }),
      },
    },
  },
};
```

### hairlineWidth()

Equivalent of ()`StyleSheet.hairlineWidth`)[https://reactnative.dev/docs/stylesheet#hairlinewidth]

```ts title=tailwind.config.js
const { hairlineWidth } = require("nativewind/theme");

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

Equivalent of (`PixelRatio.get()`)[https://reactnative.dev/docs/pixelratio#get]. If a number is provided it returns `PixelRatio.get() * <value>`, otherwise it returns the PixelRatio value.

```ts title=tailwind.config.js
const { pixelRatio } = require("nativewind/theme");

module.exports = {
  theme: {
    extend: {
      borderWidth: {
        number: pixelRatio(2),
      },
    },
  },
};
```

### pixelRatioSelect()

A helper function to use (`PixelRatio.get()`)[https://reactnative.dev/docs/pixelratio#get] in a conditional statement, similar to `Platform.select`.

```ts title=tailwind.config.js
const { pixelRatio, hairlineWidth } = require("nativewind/theme");

module.exports = {
  theme: {
    extend: {
      borderWidth: pixelRatioSelect({
        2: 1,
        default: hairlineWidth(),
      }),
    },
  },
};
```

### fontScale()

Equivalent of (`PixelRatio.getFontScale()`)[https://reactnative.dev/docs/pixelratio#getFontScale]. If a number is provided it returns `PixelRatio.getFontScale() * <value>`, otherwise it returns the `PixelRatio.getFontScale()` value.

```ts title=tailwind.config.js
const { fontScale } = require("nativewind/theme");

module.exports = {
  theme: {
    extend: {
      fontSize: {
        custom: fontScale(2),
      },
    },
  },
};
```

### fontScaleSelect()

A helper function to use (`PixelRatio.getFontScale()`)[https://reactnative.dev/docs/pixelratio#getFontScale] in a conditional statement, similar to `Platform.select`.

```ts title=tailwind.config.js
const { fontScaleSelect, hairlineWidth } = require("nativewind/theme");

module.exports = {
  theme: {
    extend: {
      fontSize: {
        custom: fontScaleSelect({
          2: 14,
          default: 16,
        }),
      },
    },
  },
};
```

### getPixelSizeForLayoutSize()

Equivalent of `PixelRatio.getPixelSizeForLayoutSize()`

```js title=tailwind.config.js
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

```ts title=tailwind.config.js
const { roundToNearestPixel } = require("nativewind/theme");

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
