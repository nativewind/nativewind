import { Text } from "react-native";
import { TestComponent } from "./test-directory";
export function Test() {
  return (
    <>
      <Text className="font-bold">Hello world!</Text>
      <TestComponent className="text-blue-500" />
    </>
  );
}
