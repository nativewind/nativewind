import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { MotiText } from "moti";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="font-bold">Hello world!</Text>
      <MotiText className="font-bold">Should be the untransformed</MotiText>
    </TailwindProvider>
  );
}
