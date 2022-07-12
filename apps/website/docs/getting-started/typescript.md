# Typescript

NativeWind extends the React Native types via declaration merging. The simplest method to include the types is to create is to a new `.d.ts` file (e.g. `my-app.d.ts`) and add a [triple-slash directive](https://www.typescriptlang.org/docs/handbook/triple-slash-directives.html) referencing the types.

```tsx
/// <reference types="nativewind/types" />
```
