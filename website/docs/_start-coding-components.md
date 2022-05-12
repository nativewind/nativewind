## Thats it 🎉

Start writing code!

Without the Babel transform you will need to wrap your components in the [styled higher-order component](../api/styled)

```diff
import { StatusBar } from 'expo-status-bar';
import React from 'react';
- import { StyleSheet, Text, View } from 'react-native';
+ import { styled, TailwindProvider, Text, View } from 'tailwindcss-react-native';

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
