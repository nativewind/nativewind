import Tabs from "@theme/Tabs";
import TabItem from "@theme/TabItem";
import CodeBlock from "@theme/CodeBlock";

# Troubleshooting

:::tip

While troubleshooting, always start your application without the cache!

- Expo `npx expo start --clear`
- React Native CLI `npx react-native start --reset-cache`

:::

Before troubleshooting NativeWind, it's crucial to ensure that Tailwind CSS itself is functioning correctly. NativeWind uses the Tailwind CLI to compile your styles, so any issues with Tailwind CLI should be resolved first. Using the command `npx tailwindcss --input <input.css> --output output.css`, Tailwind CLI will generate an `output.css` file. If you are troubleshooting a class that is not working, ensure that the css rule is present in the `output.css` file.

## Verifying NativeWind Installation

NativeWind provides a utility function `verifyInstallation()` designed to help confirm that the package has been correctly installed.

Import the `verifyInstallation` function from the NativeWind package and run within the scope of a React component. **Do not invoke this function on the global scope**, it should be run within a component.

```tsx
import React from 'react';
import { verifyInstallation } from 'nativewind';

function App() {
    // Ensure to call inside a component, not globally
    verifyInstallation();

    return (
      // Your component JSX here...
    );
}

export default App;
```

## Enabling debug mode

NativeWind supports the `DEBUG` environment variable and will output various debug information while your server is running.

<Tabs groupId="Troubleshooting">
  <TabItem value="osx" label="Mac / Linux">
    <CodeBlock language="bash">{`DEBUG=nativewind <start-command>`}</CodeBlock>
  </TabItem>
  <TabItem value="windows" label="Windows">
    <CodeBlock language="bash">{`set "DEBUG=nativewind" <start-command>`}</CodeBlock>
  </TabItem>
</Tabs>

:::warning

@react-native-community/cli may create multiple terminal sessions. You will need to ensure all sessions have `DEBUG=nativewind` set.

:::

By itself, this information may or may not be useful to you, but it is extremely useful when reporting to the developers on GitHub. You can record the terminal output by redirecting the output to a file.

<Tabs groupId="Troubleshooting">
  <TabItem value="osx" label="Mac / Linux">
    <CodeBlock language="bash">{`DEBUG=nativewind script output.log <start-command>`}</CodeBlock>
  </TabItem>
  <TabItem value="windows" label="Windows">
    If you know how to record the terminal command in a one-liner script, please open a PR to add it here.
  </TabItem>
</Tabs>

## Common Issues

### Your cache is loading old data

Always reset your cache before troubleshooting an issue.

### Colors are not working

React Native styling is much more restrictive than the web. This code will work on the web, but not on React Native:

```jsx title=App.tsx
export function App() {
  return (
    <View className="text-red-500">
      <Text>Hello, World!</Text>
    </View>
  );
}
```

The reason is that `<View />` does not accept a `color` style and will not cascade the style! Instead, you must move the color classes to the `<Text />` element

### Modifiers are not working

Ensure the component you are applying the style to supports both the style and the required props (e.g `hover:text-white` - does the component support `color` styles and have an `onHover` prop?)

### Explicit styles

React Native has various issues when conditionally applying styles. To prevent these issues it's best to declare all styles.

For example, instead of only applying a text color for dark mode, provide both a light and dark mode text color.

### dp vs px

React Native's default unit is density-independent pixels (dp) while the web's default is pixels (px). These two units are different, however NativeWind treats them as if they are equivalent. Additionally, the NativeWind's compiler requires a unit for most numeric values forcing some styles to use a `px` unit.

### Flex

React Native uses a different base flex definition to the web. This can be fixed by adding `flex-1` to your classes, which forces the platforms to align.

### Flex Direction

React Native uses a different default `flex-direction` to the web. This can be fixed by explicitly setting a `flex-direction`
