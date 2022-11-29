# Typescript

NativeWind extends the React Native types via declaration merging. A create a new filed called `my-app.d.ts` or something similar and add a [triple-slash directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) referencing the types.

```tsx
/// <reference types="nativewind/types" />
```

:::caution
Do not call this file `nativewind.d.ts`, it will cause your Typescript module resolution to fail.
:::
