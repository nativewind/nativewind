import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { TestComponent } from "./test-directory";
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
      <TestComponent
        style={{
          $$css: true,
          tailwindcssReactNative: "text-blue-500",
        }}
      />
    </TailwindProvider>
  );
}
