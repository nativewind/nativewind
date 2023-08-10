# Themes

NativeWind uses Tailwind CSS's theme configuration. By default, this is a static them with preset colors for light/dark mode.

## Dynamic themes

It is common for native apps to be more personalized and allow for users to pick a theme. So, we need to change our static them to be dynamic by using [CSS Variables as colors](https://tailwindcss.com/docs/customizing-colors#using-css-variables).

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
  return <View className="bg-primary" />
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

NativeWind is un-opinionated on the logic behind your app's theme. It simply provides the building blocks for you to use.

This is one possible way that you could implement a theme system that uses 'named' themes with light & dark modes.

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
