import StartCoding from "./\_start-coding.md"

# Quick Start

:::info
[Want a more details? View our detailed installation guide.](/installation)
:::

## 1. Create a new React Native application

```
npx create-react-native-app my-tailwind-native-app
```

Choose "Default new app"

```bash
cd my-tailwind-native-app
```

## 2. Install the dependancies

You will need to install `tailwindcss-react-native` and it's peer dependancy `tailwindcss`.

```bash
cd my-tailwind-native-app
yarn add tailwindcss-react-native
yarn add --dev tailwindcss
```

## 3. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.ts` file

Add the paths to all of your component files in your tailwind.config.js file.

```diff
// tailwind.config.js
module.exports = {
- content: [],
+ content: ["./**/*.{js,jsx,ts,tsx}"],
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

## 5. Add the TailwindProvider

Modify your `App.js` to add the `TailwindProvider`

```diff
// App.js
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
+ import { TailwindProvider } from 'tailwindcss-react-native';

export default function App() {
  return (
+   <TailwindProvider>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
      </View>
+   </TailwindProvider>
  );
}
```

<StartCoding />
