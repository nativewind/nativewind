# Troubleshooting

NativeWind is built on top of the Tailwind CSS CLI. Before troubleshooting NativeWind, it's crucial to ensure that Tailwind CSS itself is functioning correctly. You can inspect the Tailwind CSS output at the following location: `node_modules/.cache/nativewind/<input-css-filename>.<platform>.css`.

For instance, if you've observed that a custom class, `text-brand`, isn't behaving as expected. You can proceed as follows:

1. First, ensure that your `tailwind.config.js` has the necessary configurations for the color.
2. Navigate to `node_modules/.cache/nativewind/<input-css-filename>.<platform>.css` and search for the CSS class `.text-brand {}`

If you cannot locate the `.text-brand` CSS rule, it hints at an issue with your `tailwind.config.js`. To further validate this, run the command

```bash
npx tailwindcss --input <input.css>
```

If this output also lacks `.text-brand`, it confirms the misconfiguration.

To troubleshoot Tailwind CSS, refer to their [Troubleshooting Guide](https://tailwindcss.com/docs/content-configuration#troubleshooting).

**Only once you see the expected CSS being generated should you start this troubleshooting guide.**

:::tip

While troubleshooting, always start your application without the cache!

- Expo `npx expo start --clear`
- RN CLI `npx react-native start --reset-cache`

:::

## Verifying NativeWind Installation

NativeWind provides a utility function, `verifyInstallation()`, designed to help confirm that the package has been correctly installed.

Import the `verifyInstallation` function from the NativeWind package and run within the scope of a React component. It's crucial to ensure that you do not invoke this function on the global scope.

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

:::caution

`verifyInstallation()` will not work within a server context. If using React Server components or Server Side Rendering make sure `verifyInstallation` is called on the client.

:::

## A specific class name does not work

1. Reset your cache
1. Does the class name work on the [Tailwind CSS Playground](https://play.tailwindcss.com/)?
1. Ensure NativeWind supports the style
1. Ensure the component you are applying the style to supports the style or the required props (e.g `hover:text-white` - does the component support an `onHover` prop?)
