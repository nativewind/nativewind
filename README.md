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

At during your applications build, it uses the Tailwind CSS compiler to process the styles, themes, and conditional logic. It uses a minimal runtime to selectively apply reactive styles (eg changes to device orientation).

```tsx
import { Text } from "react-native";

/**
 * A button that changes color when hovered or pressed
 * The text will change font weight when the Pressable is pressed
 */
export function MyFancyButton(props) {
  return (
    <Pressable className="component bg-violet-500 hover:bg-violet-600 active:bg-violet-700">
      <Text className="font-bold component-active:font-extrabold" {...props} />;
    </Pressable>
  );
}
```

## Features

- Works on **all** RN platforms
- Uses the Tailwind compiler - **styles computed at build time**
- Small runtime
- Babel plugin for **simple setup** and better **intellisense support**
- Respects all tailwind.config.js settings, including **themes, custom values, plugins**
- **dark mode / arbitrary classes / media queries**
- pseudo classes - **hover / focus / active** on compatble components [(docs)](https://tailwindcss-react-native.vercel.app/tailwind/core-concepts/pseudo-classes)
- styling based on **parent state** - automacialy style children based upon parent psuedo classes [(docs)](https://tailwindcss-react-native.vercel.app/tailwind/core-concepts/component)
- **children styles** - create simple layouts based upon parent class

## Documentation

All documenation is on our website https://tailwindcss-react-native.vercel.app

- [Introduction](https://tailwindcss-react-native.vercel.app/)
- [Quick Start](https://tailwindcss-react-native.vercel.app/quick-start)
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
