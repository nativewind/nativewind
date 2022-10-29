import StartCoding from "../\_start-coding.md"

# React Native CLI

## 1. Create the project

```bash
npx react-native init AwesomeProject
cd AwesomeProject
```

You will need to install `nativewind` and it's peer dependency `tailwindcss`.

```bash
yarn add nativewind
yarn add --dev tailwindcss
```

## 2. Setup Tailwind CSS

Run `npx tailwindcss init` to create a `tailwind.config.js` file

Add the paths to all of your component files in your tailwind.config.js file.

```diff
// tailwind.config.js

module.exports = {
- content: [],
+ content: ["./App.{js,jsx,ts,tsx}", "./<custom-folder>/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 3. Add the Babel plugin

Modify your `babel.config.js`

```diff
// babel.config.js
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
+ plugins: ["nativewind/babel"],
};
```

## Thats it 🎉

Start writing code!

```diff
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
- StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
- Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
- const isDarkMode = useColorScheme() === 'dark';
  return (
-   <View style={styles.sectionContainer}>
+   <View className="mt-8 px-2">
-     <Text
-       style={[
-         styles.sectionTitle,
-         {
-           color: isDarkMode ? Colors.white : Colors.black,
-         },
-       ]}>
+     <Text className="text-2xl text-black dark:text-white">
        {title}
      </Text>
-     <Text
-       style={[
-         styles.sectionDescription,
-         {
-           color: isDarkMode ? Colors.light : Colors.dark,
-         },
-       ]}>
+     <Text className="mt-2 text-lg text-black dark:text-white">
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';

- const backgroundStyle = {
-   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
- };
+ const backgroundStyle = "bg-neutral-300 dark:bg-slate-900"

  return (
-   <SafeAreaView style={backgroundStyle}>
+   <SafeAreaView className={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
-       style={backgroundStyle}>
+       className={backgroundStyle}>
        <Header />
-        <View
-         style={{
-           backgroundColor: isDarkMode ? Colors.black : Colors.white,
-         }}>
+       <View className="bg-white dark:bg-black">
          <Section title="Step One">
-           Edit <Text style={styles.highlight}>App.js</Text> to change this
+           Edit <Text className="font-bold">App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

- const styles = StyleSheet.create({
-   sectionContainer: {
-     marginTop: 32,
-     paddingHorizontal: 24,
-   },
-   sectionTitle: {
-     fontSize: 24,
-     fontWeight: '600',
-   },
-   sectionDescription: {
-     marginTop: 8,
-     fontSize: 18,
-     fontWeight: '400',
-   },
-   highlight: {
-     fontWeight: '700',
-   },
- });

export default App;
```
