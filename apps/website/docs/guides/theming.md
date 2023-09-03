# Themes

NativeWind leverages Tailwind CSS's theme settings. Out of the box, it provides a static theme equipped with predefined colors for both light and dark modes.

## Dynamic themes

Modern native applications often prioritize personalization, allowing users to select their preferred themes. To transition from a static theme to a dynamic one in NativeWind, utilize [CSS Variables as colors](https://tailwindcss.com/docs/customizing-colors#using-css-variables). This approach ensures flexibility and adaptability in theme application, catering to user preferences.

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

const userTheme = vars({
  '--color-primary': 'black'
  '--color-secondary': 'white'
});

export default App() {
  return (
    <View style={userTheme}>
      <View className="bg-primary" />
    </View>
  )
}
```

## Dynamic sub-themes

Custom properties are applied to the sub-tree and can be added inline, allowing you to create dynamic sub-themes.

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

## Creating custom themes with logic

NativeWind remains agnostic about the thematic logic underpinning your application, instead offering you foundational tools to craft and shape according to your needs.

To guide you on your journey, here's a suggested method to implement a thematic system that employs 'named' themes complemented by light and dark modes:

```tsx title=Theme.tsx
import { vars, useColorScheme } from 'nativewind'

const themes = {
  brand: {
    'light': vars({
      '--color-primary': 'black'
      '--color-secondary': 'white'
    }),
    'dark': {
      '--color-primary': 'white'
      '--color-secondary': 'dark'
    }
  },
  christmas: {
    'light': vars({
      '--color-primary': 'red'
      '--color-secondary': 'green'
    }),
    'dark': vars({
      '--color-primary': 'green'
      '--color-secondary': 'red'
    })
  }
}

function Theme(props: PropWithChildren<{ name: 'brand' | 'christmas'}>) {
  const colorScheme = useColorScheme()
  return (
    <View style={themes[props.name][colorScheme]}>
      {props.children}
    </View>
  )
}

export default App() {
  return (
    <Theme name="brand">
      <View className="text-primary">{/* rgba(0, 0, 0, 1) */}>
      <Theme name="christmas">
        <View className="text-primary">{/* rgba(255, 0, 0, 1) */}>
      </Theme>
    </Theme>
  )
}
```
