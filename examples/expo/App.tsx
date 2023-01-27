import { useColorScheme } from "nativewind";
import React from "react";
import {
  LogBox,
  Text,
  View,
  Switch,
  SafeAreaView,
  StatusBar,
} from "react-native";

import "./styles.css";

LogBox.ignoreLogs(["Require cycles are allowed"]);

export default function App() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background">
      <StatusBar
        barStyle={colorScheme === "dark" ? "light-content" : "dark-content"}
      />
      <View className="p-4 flex-row items-center justify-center gap-4">
        <Text className="font-semibold text-foreground">Light</Text>
        <Switch
          value={colorScheme === "dark"}
          onChange={() => toggleColorScheme()}
        />
        <Text className="font-semibold text-foreground">Dark</Text>
      </View>
      <View className="flex-1 justify-center px-4 space-y-4">
        <Text className="font-bold text-foreground text-center">
          Welcome to NativeWind!
        </Text>
        <Text className="border-hairline border-foreground rounded-xl p-3 font-mono text-foreground">
          {JSON.stringify({ colorScheme }, undefined, 2)}
        </Text>
      </View>
    </SafeAreaView>
  );
}
