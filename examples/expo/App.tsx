import React from "react";
import { Text, View, LogBox } from "react-native";

import "./styles.css";

LogBox.ignoreLogs(["Require cycles are allowed"]);

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-red-100">
      <Text>Open up App.js to start working on your app!!</Text>
    </View>
  );
}
