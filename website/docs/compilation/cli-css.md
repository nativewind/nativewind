import StartCoding from "../\_start-coding-components.md"
import ReactNativeWebPreview from "./\_react-native-web-0-18-preview.md"

# Tailwind CLI (CSS) 🔬

<ReactNativeWebPreview />

This preview feature allows you to use the Tailwind CLI to generate CSS stylesheets. You can then use className to style your React Native Web components using CSS.

## Setup

### 1. Setup Tailwind CSS

Follow the [setup guide for Tailwind CLI](https://tailwindcss.com/docs/installation).

### 2. Enable preview features

You will need to enable preview features on your `TailwindProvider`

```diff
import { TailwindProvider } from 'tailwindcss-react-native'

function MyAppsProviders ({ children }) {
  return (
-   <TailwindProvider>{children}</TailwindProvider>
+   <TailwindProvider preview={true}>{children}</TailwindProvider>
  )
}
```

<StartCoding />

## Watching for changes

You can use the Tailwind CLI with the `--watch` flag to automatically compile on save.

This can be combined with [concurrently](https://www.npmjs.com/package/concurrently) to create a streamlined development environment.

```diff
// package.json
{
  "scripts": {
-   "start": "expo start"
+   "start": "concurrently \"tailwindcss -i input.css -o output.css --watch\" \"expo start:web\""
  },
  // ...
}
```
