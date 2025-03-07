import StartCoding from "../\_start-coding.md"
import NPM from "../\_npm.mdx";
import Tailwind from "../\_tailwind.mdx"

# Babel (transform only)

Some frameworks (eg Next.js) provide an optimized pipeline for their CSS output and/or have first-class Tailwind support. In this case, you can use to framework to compile the styles and have Babel simply transform your components.

## Setup

### 1. Install the dependencies

<NPM />

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
