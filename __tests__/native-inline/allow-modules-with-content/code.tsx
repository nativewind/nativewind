import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { MotiText } from "moti";
import { TestComponent } from "./test";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="font-bold">Hello world!</Text>
      <MotiText className="font-bold">Do not transform</MotiText>
      <TestComponent className="font-bold">Do not transform</TestComponent>
    </TailwindProvider>
  );
}
