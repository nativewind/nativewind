import { Text } from "react-native";
import { TailwindProvider } from "../../../src";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="font-bold">Hello world!</Text>
      <div className="text-white">Should be untransformed</div>
    </TailwindProvider>
  );
}
