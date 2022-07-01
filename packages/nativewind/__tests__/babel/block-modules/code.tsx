import { Text } from "react-native";
import { MotiText } from "moti";

export function Test() {
  return (
    <>
      <Text className="font-bold">Hello world!</Text>
      <MotiText className="font-bold">Should be the untransformed</MotiText>
    </>
  );
}
