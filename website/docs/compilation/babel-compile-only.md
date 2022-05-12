import StartCoding from "../\_start-coding-components.md"

# Babel (compile only)

Not everyone wants their components transformed via Babel, so a compile only version of tailwindcss-react-native is available. This version just compiles and injects the Tailwind CSS styles.

## Setup

### 1. Setup tailwindcss-react-native

Follow the [general setup instructions](../installation.md) to setup tailwindcss-react-native.

### 2. Configure your babel.config.js

```diff
// babel.config.js
module.exports = {
- plugins: ["tailwindcss-react-native/babel"],
+ plugins: [["tailwindcss-react-native/babel", { mode: "compileOnly" }],
};
```

<StartCoding />
