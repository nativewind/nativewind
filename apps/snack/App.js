import "nativewind/expo-snack";
import React from "react";
import { View, Text } from "react-native";
import { vars } from "nativewind";

const theme = vars({
  "--theme-fg": "black",
});

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Text className="text-[--theme-fg]">Try editing me</Text>
    </View>
  );
};

export default App;
