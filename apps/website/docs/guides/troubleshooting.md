# Troubleshooting

:::tip

While troubleshooting, always start your application without the cache!

- Expo `npx expo start --clear`
- React Native CLI `npx react-native start --reset-cache`

:::

Before troubleshooting NativeWind, it's crucial to ensure that Tailwind CSS itself is functioning correctly. NativeWind uses the Tailwind CLI to compile your styles, so any issues with Tailwind CLI should be resolved first. You can inspect the Tailwind CSS output at the following location: `node_modules/.cache/nativewind/<input-css-filename>.<platform>.css`, or by simply running `npx tailwindcss --input <input.css>`.

For instance, if you've observed that a custom class `text-brand` isn't behaving as expected. You can proceed as follows:

1. First, ensure that your `tailwind.config.js` has the necessary configurations for the color.
2. Navigate to `node_modules/.cache/nativewind/<input-css-filename>.<platform>.css` and search for the CSS class `.text-brand {}`

If you cannot locate the `.text-brand` CSS rule, it hints at an issue with your `tailwind.config.js`. To further validate this, run the command

```bash
npx tailwindcss --input <input.css>
```

If this output also lacks `.text-brand`, it confirms the misconfiguration.

To troubleshoot Tailwind CSS, refer to their [Troubleshooting Guide](https://tailwindcss.com/docs/content-configuration#troubleshooting).

**Only once you see the expected CSS being generated should you start this troubleshooting guide.**

## Verifying NativeWind Installation

NativeWind provides a utility function, `verifyInstallation()`, designed to help confirm that the package has been correctly installed.

Import the `verifyInstallation` function from the NativeWind package and run within the scope of a React component. **It's crucial to ensure that you do not invoke this function on the global scope.**

:::tip

`verifyInstallation()` will `warn` on success and `error` on failure. If you do not see any output check the function is being executed correctly.

:::

```tsx
import React from 'react';
import { verifyInstallation } from 'nativewind';

function App() {
    // Ensure to call inside a component, not globally
    verifyInstallation();

    return (
      // Your component JSX here...
    );
}

export default App;
```

## Common Issues

### Your cache is loading old data

Always reset your cache before troubleshooting an issue.

### Colors are not working

React Native styling is much more restrictive than the web. This code will work on the web, but not on React Native:

```jsx title=App.tsx
export function App() {
  return (
    <View className="text-red-500">
      <Text>Hello, World!</Text>
    </View>
  );
}
```

The reason is that `<View />` does not accept a `color` style and will not cascade the style! Instead, you must move the color classes to the `<Text />` element

### Modifiers are not working

Ensure the component you are applying the style to supports both the style and the required props (e.g `hover:text-white` - does the component support `color` styles and have an `onHover` prop?)

### Explicit styles

React Native has various issues when conditionally applying styles. To prevent these issues it's best to declare all styles.

For example, instead of only applying a text color for dark mode, provide both a light and dark mode text color.

### dp vs px

React Native's default unit is density-independent pixels (dp) while the web's default is pixels (px). These two units are different, however NativeWind treats them as if they are equivalent. Additionally, the NativeWind's compiler requires a unit for most numeric values forcing some styles to use a `px` unit.

### Flex

React Native uses a different base flex definition to the web. This can be fixed by adding `flex-1` to your classes, which forces the platforms to align.

### Flex Direction

React Native uses a different default `flex-direction` to the web. This can be fixed by explicitly setting a `flex-direction`
