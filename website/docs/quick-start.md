import StartCoding from "./\_start-coding.md"

# Quick Start

## 1. Create a new React Native application

```
npx create-react-native-app my-nativewind-app
```

Choose "Default new app" and then move into the project's directory.

```bash
cd my-nativewind-app
```

## 2. Install the dependencies

You will need to install `nativewind` and it's peer dependency `tailwindcss`.

```bash
yarn add nativewind
yarn add --dev tailwindcss
```

## 3. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.ts` file

Add the paths to all of your component files in your tailwind.config.js file.

```diff
// tailwind.config.js

module.exports = {
- content: [],
+ content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 4. Add the Babel plugin

Modify your `babel.config.js`

```diff
// babel.config.js
module.exports = {
- plugins: [],
+ plugins: ["tailwindcss-react-native/babel"],
};
```

<StartCoding />
