---
sidebar_position: 1
---

# Babel

Options can be provided via the babel config

```js
// babel.config.js
module.exports = {
  plugins: [
    [
      "tailwindcss-react-native/babel",
      { tailwindConfig: "./tailwind.native.config.js" },
    ],
  ],
};
```

| Option               | Values                                            | Default                                       | Description                                                                                                |
| -------------------- | ------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| platform             | `native`, `web`                                   | `native`                                      | Specifies how the className is transformed.                                                                |
| mode                 | `compileAndTransform, compileOnly, transformOnly` | `compileAndTransform`                         |                                                                                                            |
| hmr                  | `boolean`                                         | Development: `true` <br />Production: `false` | Allow fast-refresh of styles. This products a larger bundle, but provides a better development experience. |
| tailwindConfig       | Path relative to `cwd`                            | `tailwind.config.js`                          | Provide a custom `tailwind.config.js`. Useful for setting a different theme per platform.                  |
| allowModuleTransform | `*`, `string[]`                                   | `*`                                           | Only transform components from these imported modules. `*` will transform all modules.                     |
| blockModuleTransform | `string[]`                                        | `[]`                                          | Do not transform components from these imported modules.                                                   |
