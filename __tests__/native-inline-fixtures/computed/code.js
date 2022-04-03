import { Text } from "react-native";
import { TailwindProvider } from "../../../src";

export function Test() {
  const a = "font-bold";
  return (
    <TailwindProvider>
      <Text className={a}>Hello world!</Text>
    </TailwindProvider>
  );
}
