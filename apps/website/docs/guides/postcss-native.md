import StartCoding from "../\_start-coding-components.md"

# PostCSS

## Setup

### 1. Create a PostCSS config file

Add tailwindcss and to your postcss.config.js file, or wherever PostCSS is configured in your project.

```js
// postcss.config.js
module.exports = {
  plugins: [
    require("tailwindcss"),
    [
      require("nativewind/postcss"),
      {
        /* options */
      },
    ],
  ],
};
```

### 2. Add the `@tailwind` directives

Add the @tailwind directives for each of Tailwind’s layers to your main CSS file.

```css
// base.css
@tailwind components;
@tailwind utilities;
```

### 3. Start your build process

Run your build process with npm run dev or whatever command is configured in your package.json file.

This will create `nativewind-output.js`

### 4. Update the TailwindProvider

```diff
import { TailwindProvider } from 'nativewind'
+ import * as tailwindProviderProps from "./nativewind-output"

function MyAppsProviders ({ children }) {
    return (
-       <TailwindProvider>{children}</TailwindProvider>
+       <TailwindProvider {...tailwindProviderProps}>{children}</TailwindProvider>
    )
}
```

<StartCoding />
