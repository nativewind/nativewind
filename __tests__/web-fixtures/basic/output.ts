import { Text } from "react-native";
import { TailwindProvider } from "../../../src";
export function Test() {
  return (
    <TailwindProvider>
      <Text
        style={{
          $$css: true,
          tailwindcssReactNative: "font-bold",
        }}
      >
        Hello world!
      </Text>
    </TailwindProvider>
  );
}
