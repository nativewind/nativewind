import StartCoding from "../\_start-coding-components.md"
import Dependencies from "../\_dependencies.mdx"
import Tailwind from "../\_tailwind.mdx"

# Babel (transform only)

Some frameworks provide an optimised pipeline for their CSS files. Babel to transform your components

## Setup

### 1. Install the dependencies

<Dependencies />

### 2. Setup Tailwindcss

<Tailwind />

### 3. Configure your babel.config.js

```js
// babel.config.js
module.exports = {
  plugins: [["nativewind/babel", { mode: "transformOnly" }]],
};
```

<StartCoding />
