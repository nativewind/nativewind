import { Text } from "react-native";
import { TestComponent } from "./test";
export function Test() {
  return (
    <>
      <Text className="font-bold">Hello world!</Text>
      <TestComponent className="text-blue-500" />
    </>
  );
}
