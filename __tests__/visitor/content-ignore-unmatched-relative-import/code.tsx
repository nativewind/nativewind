import { Text } from "react-native";
import { ShouldNotBeTransformed } from "./should-not-be-transformed";

export function Test() {
  return (
    <>
      <Text className="font-bold">Hello world!</Text>
      <ShouldNotBeTransformed className="font-bold" />
    </>
  );
}
