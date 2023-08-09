# Troubleshooting

NativeWind is built on the foundation of the Tailwind CSS CLI. Before attributing issues to NativeWind, it's crucial to ensure that Tailwind CSS itself is functioning correctly. You can inspect the Tailwind CSS output at the following location:

```bash
node_modules/.cache/nativewind/<input-css-filename>.<platform>.css`.
```

For instance, if you've observed that a custom class, say text-brand, isn't behaving as expected, proceed as follows:

1. First, ensure that your tailwind.config.js has the necessary configurations for the color.
2. Navigate to: `node_modules/.cache/nativewind/<input-css-filename>.<platform>.css` and search for the CSS class .text-brand.

If you don't locate the .text-brand CSS rule, it hints at an issue with your tailwind.config.js. To further validate this run the command

```bash
npx tailwindcss --input <input.css>
```

If this output also lacks `.text-brand`, it confirms the misconfiguration.

For additional troubleshooting related to Tailwind CSS, refer to their Troubleshooting Guide. An example error might be neglecting to include .jsx files in your content glob.

**Only once you see the expected CSS being generated should you start this troubleshooting guide.**

:::tip

While troubleshooting, always start your application without the cache!

- Expo `npx expo start --clear`
- RN CLI `npx react-native start --reset-cache`

:::

## Verifying NativeWind Installation

NativeWind provides a utility function, verifyInstallation(), designed to help confirm that the package has been correctly installed.

To use this verification function:

Import the verifyInstallation function from the NativeWind package.
Run the verifyInstallation() function within the scope of a React component. It's crucial to ensure that you do not invoke this function on the global scope.

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

Remember, always call verifyInstallation within a component's scope for accurate results.

## A specific className does not work

1. Reset your cache
1. Does it work on the [Tailwind CSS Playground](https://play.tailwindcss.com/)?
1. Ensure NativeWind supports the style
1. Ensure the component you are applying the style to supports the style or the required props (e.g `hover:text-white` - does the component support an `onHover` prop?)
