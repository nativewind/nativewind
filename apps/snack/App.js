import React from "react";
import { View, Text } from "react-native";
import { withExpoSnack } from "./expo-snack";
import { vars, StyleSheet } from "nativewind";
import { render } from "react-native-css-interop/dist/runtime/components/rendering";

const theme = vars({
  "--theme-fg": "black",
});

const originalCreateElement = React.createElement;
React.createElement = function (type, props, ...args) {
  if (props?.className) fetchStyle(props.className);
  return render(originalCreateElement, type, props, ...args);
};

const isOk = (response) =>
  response.ok ? response.json() : Promise.reject(response);

const alreadyProcessed = new Set();
function fetchStyle(className) {
  className = className
    .split(" ")
    .filter((c) => !alreadyProcessed.has(c))
    .join(" ");
  if (!className) return;
  fetch(`https://nativewind.dev/api/compile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: className }),
  })
    .then(isOk)
    // .then((body) => {
    //   content.split(" ").forEach((c) => alreadyProcessed.add(c));
    //   StyleSheet.registerCompiled(body);
    // })
    .catch((error) => {
      console.error(error);
      console.error("Error connecting to NativeWind snack server");
    });
}

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Text className="text-[--theme-fg]">Try editing me!!! 🎉</Text>
    </View>
  );
};

export default withExpoSnack(App);
