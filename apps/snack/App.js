import React from "react";
import { View, Text, Pressable, withExpoSnack } from "./expo-snack";
import { vars } from "nativewind";

const theme = vars({
  "--theme-fg": "black",
});

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Text
        className="text-[--theme-fg] text-2xl"
        style={{ color: "red", fontSize: 50 }}
      >
        Try editing me!!! 🎉
      </Text>
    </View>
  );
};

export default withExpoSnack(App);
