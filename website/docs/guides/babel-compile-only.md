import StartCoding from "../\_start-coding-components.md"
import Dependencies from "../\_dependencies.mdx"
import Tailwind from "../\_tailwind.mdx"

# Babel (compile only)

Babel helps reduce the projects boilerplate, but is not required for actual use. This version just compiles and injects the Tailwind CSS styles.

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
