import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { ShouldNotBeTransformed } from "./should-not-be-transformed";
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
      <ShouldNotBeTransformed className="font-bold" />
    </TailwindProvider>
  );
}
