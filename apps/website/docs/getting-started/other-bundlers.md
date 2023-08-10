# Other web bundlers

NativeWind provides installation instructions for the two most common bundlers, Metro and Next.js. However, you can use NativeWind with web bundler as long as:

1. Tailwind CSS is setup
2. React Native compiles correctly (using React Native Web for web)
3. The JSX runtime is changed to `'automatic'` and `jsxImportSource` set to `'nativewind'`

Bundlers will use a transpiler like babel, swc, esbuild or tsc to transpile the code. You will need to check the documentation of your bundler's transpiler to identify how to change the `jsxImportSource`.

If your bundler uses Babel, you use use the `nativewind/babel` preset.
