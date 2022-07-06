import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

// NativeWindStyleSheet.setOutput({
//   eb: "native",
// });

export default function App() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-slate-800">
        Open up App.js to start working on your app!
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
