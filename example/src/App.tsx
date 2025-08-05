import { Text, View } from "react-native";

import "../global.css";

export default function App() {
  return (
    <>
      <View className="justify-center items-center h-full">
        <Text className="text-green-500">Test Component</Text>
        <Text className="tabular-nums">12121</Text>
        <Text className="tabular-nums">90909</Text>
      </View>
    </>
  );
}
