import { Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { MotiText } from "moti";

export function Test() {
  return (
    <TailwindProvider>
      <View className="container">
        <Text className="font-bold">Hello world!</Text>
        <MotiText className="font-bold">Do not transform</MotiText>
      </View>
    </TailwindProvider>
  );
}
