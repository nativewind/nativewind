import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="w-screen">Hello world!</Text>
    </TailwindProvider>
  );
}
