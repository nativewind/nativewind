---
sidebar_position: 200
---

# Quick start guide

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
npm install tailwindcss-react-native
npm install --save-dev tailwindcss
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
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
+ import { TailwindProvider } from 'tailwindcss-react-native';

export default function App() {
  return (
+   <TailwindProvider>
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
+   </TailwindProvider>
  );
}
```

## Thats it 🎉

Start writing code!

```diff
import { StatusBar } from 'expo-status-bar';
import React from 'react';
- import { StyleSheet, Text, View } from 'react-native';
+ import { Text, View } from 'react-native';
import { TailwindProvider } from 'tailwindcss-react-native';

export default function App() {
  return (
    <TailwindProvider>
-     <View style={styles.container}>
+     <View className="flex-1 items-center justify-center bg-white">
        <Text>Open up App.js to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </TailwindProvider>
  );
}

- const styles = StyleSheet.create({
-   container: {
-     flex: 1,
-     backgroundColor: '#fff',
-     alignItems: 'center',
-     justifyContent: 'center',
-   },
- });
```
