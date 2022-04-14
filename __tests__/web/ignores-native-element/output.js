import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
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
      <div className="text-white">Should be untransformed</div>
    </TailwindProvider>
  );
}
