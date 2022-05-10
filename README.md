<div align="center">
<p align="center">
  <a href="https://tailwindcss-react-native.vercel.app" target="_blank">
    <img src="https://tailwindcss-react-native.vercel.app/img/logo.svg" alt="Tailwind CSS" width="70" height="70">
    <h1 align="center" style="color:red;">tailwindcss-react-native</h1>
  </a>
</p>
<img alt="GitHub branch checks state" src="https://img.shields.io/github/checks-status/marklawlor/tailwindcss-react-native/next">
<img alt="npm" src="https://img.shields.io/npm/v/tailwindcss-react-native">
<img alt="npm" src="https://img.shields.io/npm/dt/tailwindcss-react-native">
<img alt="GitHub" src="https://img.shields.io/github/license/marklawlor/tailwindcss-react-native">
</div>
<br />

`tailwindcss-react-native` uses [Tailwind CSS](https://tailwindcss.com) as **universal design system** for all React Native platforms. It lets you share code between all React Native platforms and improves DX, performance and code maintainability.

It is powered by the Tailwind CSS compiler to process the styles, themes, responsive and conditional logic. The styles can than be used as React Native Stylesheets or as CSS - whatever suits your platform best!

## Features

- Works on all RN platforms (including Web, Macos & Windows)
- Uses the Tailwind compiler
- Can be used with either React Native or CSS StyleSheets!
- Babel plugin for simple setup, or can integrate with your tooling
- Fast refresh compatible
- Respects all tailwind.config.js settings, including themes, custom values, plugins
- Supports dark mode / arbitrary classes / media queries
- Styles processed at build time - not runtime

## Documentation

All documenation is on our website https://tailwindcss-react-native.vercel.app

- [Introduction](https://tailwindcss-react-native.vercel.app/)
- [Installation](https://tailwindcss-react-native.vercel.app/installation)

## In action

You can use the Babel plugin to instantly start writing code! This will also enable your editor's language support and provide features such as autocomplete with no extra setup!

```tsx
import { Text } from "react-native";

export function BoldText(props) {
  return <Text className="text-bold" {...props} />;
}
```

Or use the Component API to be more explicit about what gets the styles.

```tsx
import { Text } from "react-native";
import { styles } from "tailwindcss-react-native";

const StyledText = styled(Text);

export function BoldText(props) {
  return <StyledText className="text-bold" {...props} />;
}
```

You still have the ability to perform conditional logic and built up complex style objects.

```tsx
import { Text } from "react-native";

export function MyText({ bold, italic, lineThrough, ...props }) {
  const classNames = [];

  if (bold) classNames.push("font-bold");
  if (italic) classNames.push("italic");
  if (lineThrough) classNames.push("line-through");

  return <Text className={classNames.join(" ")} {...props} />;
}
```

And access the styles directly

```tsx
import { Text } from "react-native";
import { useTailwind } from "tailwindcss-react-native";

export function MyActivityIndicator(props) {
  const tw = useTailwind();

  const { color } = tx("text-blue-500");

  return <ActivityIndicator size="small" color={color} {...props} />;
}
```

# Quick start guide

> There are more setup configurations and in-depth guides [on our website](https://tailwindcss-react-native.vercel.app/installation)

## 1. Create a new React Native application

```
npx create-react-native-app my-tailwind-native-app;

```

Choose "Default new app"

Then change your `cwd` to the folder containing the project

```bash
cd my-tailwind-native-app
```

## 2. Install the dependancies

You will need to install `tailwindcss-react-native` and it's peer dependancy `tailwindcss`.

```bash
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
