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

## Identifier '***' has already been declared inside a node_module

Example error:

```
/node_modules/react-native-web/dist/vendor/react-native/FlatList/index.js 105:7
Module parse failed: Identifier 'StyleSheet' has already been declared (105:7)
File was processed with these loaders:

./node_modules/@expo/webpack-config/node_modules/babel-loader/lib/index.js
You may need an additional loader to handle the result of these loaders.
| import deepDiffer from "../deepDiffer";
| import * as React from 'react';
```

This can occur when your `tailwind.config.js` processes an unexpected file in your `node_modules`. You need to avoid [broad content patterns](https://tailwindcss.com/docs/content-configuration#pattern-recommendations), as it will process things like your `node_modules`


```diff
// tailwind.config.js
module.exports = {
  content: [
-   './**/*.{html,js,jsx}',
+   './src/**/*.{html,js,jsx}',
  ],
  // ...
}
```

After changing your `tailwind.config.js` you will need to reset your cache either by `expo start -c` or `react-native start --reset-cache`.
