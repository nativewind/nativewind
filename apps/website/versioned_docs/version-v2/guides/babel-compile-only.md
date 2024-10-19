import StartCoding from "../\_start-coding-components.md"
import Dependencies from "../\_dependencies.mdx"
import Tailwind from "../\_tailwind.mdx"

# Babel (compile only)

NativeWind provides two methods to style components, the `className` prop (which requires a Babel transformation) and the `styled()` wrapper. If you are exclusively using the `styled()` wrapper you can improve your build time by changing to `compileOnly` mode which skips the transform step.

## Setup

### 1. Install the dependencies

<Dependencies />

### 2. Setup Tailwindcss

<Tailwind />

### 3. Configure your babel.config.js

```js
// babel.config.js
module.exports = {
  plugins: [["nativewind/babel", { mode: "compileOnly" }]],
};
```

<StartCoding />
