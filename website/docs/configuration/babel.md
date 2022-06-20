# Babel

Options can be provided via the babel config

```js
// babel.config.js
module.exports = {
  plugins: [
    ["nativewind/babel", { tailwindConfig: "./tailwind.native.config.js" }],
  ],
};
```

| Option               | Values                                            | Default               | Description                                                                               |
| -------------------- | ------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| mode                 | `compileAndTransform, compileOnly, transformOnly` | `compileAndTransform` |                                                                                           |
| tailwindConfig       | Path relative to `cwd`                            | `tailwind.config.js`  | Provide a custom `tailwind.config.js`. Useful for setting a different theme per platform. |
| allowModuleTransform | `*`, `string[]`                                   | `*`                   | Only transform components from these imported modules. `*` will transform all modules.    |
| blockModuleTransform | `string[]`                                        | `[]`                  | Do not transform components from these imported modules.                                  |
