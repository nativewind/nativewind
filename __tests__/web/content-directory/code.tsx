import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { TestComponent } from "./test-directory";
export function Test() {
  return (
    <TailwindProvider>
      <Text className="font-bold">Hello world!</Text>
      <TestComponent className="text-blue-500" />
    </TailwindProvider>
  );
}
