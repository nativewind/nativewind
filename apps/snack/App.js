import React from "react";
import { withNativeWind } from "nativewind/expo-snack";
import { View, Text } from "react-native";
import { vars } from "nativewind";

const theme = vars({
  "--theme-fg": "green",
});

const App = () => {
  return (
    <View className="flex-1 items-center justify-center" style={theme}>
      <Text className="font-bold text-[--theme-fg] ">Variables!</Text>
      <Text className="font-bold active:scale-150 active:text-[--theme-fg] transition">
        Transitions
      </Text>
      <Text className="font-bold animate-bounce">Animations</Text>
    </View>
  );
};

export default withNativeWind(App);
