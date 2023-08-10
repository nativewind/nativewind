# Theming

NativeWind uses Tailwind CSS's theme configuration. By default, this is a static them with preset colors for light/dark mode. This works well for the web, but native apps tend to be more personalized and allow for user customization. By changing the theme to use [CSS Variables as colors](https://tailwindcss.com/docs/customizing-colors#using-css-variables), NativeWind's theme suddenly becomes dynamic.

By setting inline variables on a component, the entire tree will be rendered with the new values, allowing for sub-theming.

```js title=tailwind.config.js
module.exports = {
  theme: {
    colors: {
      // Create a custom color that uses a CSS custom value
      primary: "rgb(var(--color-primary) / <alpha-value>)",
    },
  },
  plugins: [
    // Set a default value on the `:root` element
    ({ addBase }) => addBase({ ":root": "--color-primary: 255 0 0" }),
  ],
};
```

```tsx title=App.tsx
import { vars } from 'nativewind'

export default App() {
  return (
    <View className="bg-primary">{/* rgba(255, 0, 0, 1) */}>
      <View style={vars({ 'color-primary': '0 0 255' })}>
        <View className="bg-primary">{/* rgba(0, 0, 255, 1 */} />
      </View>
    </View>
  )
}
```
