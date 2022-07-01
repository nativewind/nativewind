# Colors

You can customise your colors in the same manner as Tailwind CSS. Please refer to the [Tailwind CSS documentation](https://tailwindcss.com/docs/customizing-colors) for more information.

## Platform Colors

Unlike the web, which uses a common color palette, native platforms have their own unique system colors which as access through [PlatformColor](https://reactnative.dev/docs/platformcolor)

NativeWind allows you to use access PlatformColor via the special `platformColor()` syntax in your theme.

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

:::note

There are no quotes between the brackets in `platformColor(systemRed)`

:::
