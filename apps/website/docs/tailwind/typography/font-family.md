import Compatibility from "../\_compatibility.mdx"
import Usage from "../\_usage.mdx"

# Font Family

## Usage

<Usage />

### Differences on Native

React Native does not support fallback fonts. If an array of fonts are provided, NativeWind will only use the first font.

### Adding fonts to your theme

:::info

NativeWind will not load/link fonts into your app. If you have any issues with the font family or weights not rendering, please first verify it works with inline styles.

:::

```tsx
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        example: ["ExampleFontFamily"],
      },
    },
  },
};
```

### Handling different platforms

On React Native, iOS and Android load fonts slightly differently. For an improved Tailwind experience, we recommend following a guide (such as [this one](https://github.com/jsamr/react-native-font-demo)) to correct setup your fonts to allow for a consistent experience.

## Compatibility

<Compatibility
supported={[
"font-[n]",
"font-{n}",
]}
none={[
"font-sans",
"font-serif",
"font-mono",
]}
/>
