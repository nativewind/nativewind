import { Text, View } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";

export function Test() {
  return (
    <TailwindProvider>
      <View tw="container">
        <Text tw="font-bold">Hello world!</Text>
      </View>
    </TailwindProvider>
  );
}
