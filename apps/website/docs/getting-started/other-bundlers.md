# Other bundlers

NativeWind provides installation instructions for the two most common bundlers, Metro and Next.js. However, you can use NativeWind with any bundler. To use NativeWind, three conditions need to be met:

1. Tailwind CSS is setup, with the NativeWind preset
1. React Native is working correctly (using React Native Web >=0.17 for web)
1. The JSX runtime is changed to `'automatic'` and `jsxImportSource` set to `'nativewind'`

## Troubleshooting Web bundlers

**Is TailwindCSS setup?**

You can test Tailwind CSS by rendering `<div class="w-10 h-10 bg-red-500" />`. You should see see a red square if setup correctly. Please follow the [Tailwind CSS installation instructions for setup and troubleshooting.](https://tailwindcss.com/docs/installation)

**Is React Native Web setup?**

Replace your `div` with:

```tsx
<View style={{ $$css: true, test: "w-10 h-10 bg-blue-500" }} />
```

You should see a blue square if setup correctly.

**Is JSX runtime set to `automatic` dn `jsxImportSource` set to `'nativewind'`**

Replace your `View` with

```tsx
<View className="w-10 h-10 bg-blue-500" />
```

## Native bundlers

Metro is the only supported native bundler.
