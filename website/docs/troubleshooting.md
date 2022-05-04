---
sidebar_position: 999
---

# Troubleshooting

## Components are not being transformed

Make sure your `tailwind.config.js` content configuration is correct and matches all of the right source files.

A common mistake is missing a file extension, for example if you’re using jsx instead of js for your React components:

```diff
// tailwind.config.js
module.exports = {
  content: [
-   './src/**/*.{html,js}',
+   './src/**/*.{html,js,jsx}'
  ],
  // ...
}
```

Or creating a new folder mid-project that wasn’t covered originally and forgetting to add it to your configuration:

```diff
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}',
+   './util/**/*.{html,js}'
  ],
  // ...
}
```

## Don't construct class names dynamically

The TailwindCSS compiler [does not allow for dynamic class names](https://tailwindcss.com/docs/content-configuration#dynamic-class-names). Use this pattern instead

```diff
- <Text className="text-{{ error ? 'red' : 'green' }}-600"></Text>
+ <Text className="{{ error ? 'text-red-600' : 'text-green-600' }}"></Text>
```

## className is not passed to child components

The `className` prop is not passed to child components, it is transformed into a style object and passed via the `style` prop.
