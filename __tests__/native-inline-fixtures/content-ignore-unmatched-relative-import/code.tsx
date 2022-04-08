import { Text } from "react-native";
import { TailwindProvider } from "../../../src";
import { ShouldNotBeTransformed } from "./should-not-be-transformed";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="font-bold">Hello world!</Text>
      <ShouldNotBeTransformed className="font-bold" />
    </TailwindProvider>
  );
}
