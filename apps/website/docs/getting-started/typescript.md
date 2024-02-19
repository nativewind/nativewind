# Typescript

NativeWind extends the React Native types via declaration merging. The simplest method to include the types is to create a new `nativewind-env.d.ts` file and add a [triple-slash directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) referencing the types.

```tsx
/// <reference types="nativewind/types" />
```

:::caution
Do not call this file:

- `nativewind.d.ts`
- The same name as a file or folder in the same directory e.g `app.d.ts` when an `/app` folder exists
- The same name as a folder in `node_modules`, e.g `react.d.ts`

By doing so, your types will not be picked up by the TypeScript compiler.
:::
