---
sidebar_position: 999
---

# CLI

If your application does not support Babel or PostCSS you can still compile Tailwind CSS via the `tailwindcss-react-native` CLI and manually inject the styles.

## 1. Setup tailwindcss-react-native

Follow the [general setup instructions](//installation) to setup tailwindcss-react-native.

## 2. Compile the styles

In your commandline you will need to run the `tailwindcss-react-native` CLI

```bash
npx tailwindcss-react-native --platform native
```

## 3. Update the TailwindProvider

```diff
import { TailwindProvider } from 'tailwindcss-react-native'
+ import * as tailwindProviderProps from "./tailwindcss-react-native-output"

function MyAppsProviders ({ children }) {
    return (
-       <TailwindProvider>{children}</TailwindProvider>
+       <TailwindProvider {...tailwindProviderProps}>{children}</TailwindProvider>
    )
}
```

## 4. Update your scripts (optional)

Manually compiling styles while developing can be tedious. You can use the `tailwindcss-react-native` CLI with the `--watch` flag to automatically compile on save.

This can be conbined with [concurrently](https://www.npmjs.com/package/concurrently) to create a streamlined development environment.

```diff
// package.json
{
  "scripts": {
-   "start": "expo start"
+   "start": "concurrently \"tailwindcss-react-native --platform native --watch\" \"expo start\""
  },
  // ...
}
```
