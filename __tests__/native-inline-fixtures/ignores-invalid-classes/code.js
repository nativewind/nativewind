import { Text } from "react-native";
import { TailwindProvider } from "../../../src";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="grid grid-cols-3">Hello world!</Text>
    </TailwindProvider>
  );
}
