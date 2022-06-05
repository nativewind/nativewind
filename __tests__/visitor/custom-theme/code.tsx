import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="text-blue-500">Hello world!</Text>
    </TailwindProvider>
  );
}
