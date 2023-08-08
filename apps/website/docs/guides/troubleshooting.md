# Troubleshooting

NativeWind is built on top of Tailwind CSS CLI, so before you suspect an issue with NativeWind you should ensure that Tailwind CSS is working as expected. You can see the Tailwind CSS output by inspecting the file `node_modules/.cache/nativewind/<input-css-filename>.<platform>.css`.

For example, are suspect that your custom class `text-brand` is not working. You have verified that your `tailwind.config.js` has color's correctly configured, but it appears NativeWind is not working.

1. Open `node_modules/.cache/nativewind/<input-css-filename>.<platform>.css`
2. Look for the CSS class `.text-brand`

In this hypothetical scenario, we're unable to find the CSS rule for `.text-brand`. \*\*Therefor there is a problem with our `tailwind.config.js`. We can verify this by running `npx tailwindcss --input <input.css>` and seeing that it too doesn't contain `.text-brand`. After following (Tailwind CSS' Troubleshooting guide)[https://tailwindcss.com/docs/content-configuration#troubleshooting] you find that you forgot to include `.jsx` files in your `content` glob.

**Only once you see the expected CSS being generated should you start this troubleshooting guide.**

:::tip

While troubleshooting, always start your application without the cache!

- Expo `npx expo start --clear`
- RN CLI `npx react-native start --reset-cache`

:::

## Running `verifyInstallation()`

NativeWind includes a helper function called `verifyInstallation()` to verify it has been installed correctly. You should run `verifyInstallation` inside a React component (not on the global scope)

```tsx
import { verifyInstallation } from "nativewind";

export function App() {
  // Make this you run this inside a component
  verifyInstallation();

  return <View />;
}
```

`verifyInstallation()` will `error` if there is a problem and `warn` on success. If you do not receive any message, please verify it was run correctly. You can use this both on native and web to verify either platform.

Please follow any instructions provided by `verifyInstallation`.
