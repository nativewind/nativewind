import { StyleSheet } from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { TestComponent } from "./test-directory";
export function Test() {
  return (
    <TailwindProvider>
      <Text
        style={useTailwind("font-bold", {
          styles: __tailwindStyles,
          media: __tailwindMedia,
        })}
      >
        Hello world!
      </Text>
      <TestComponent
        style={useTailwind("text-blue-500", {
          styles: __tailwindStyles,
          media: __tailwindMedia,
        })}
      />
    </TailwindProvider>
  );
}

const __tailwindStyles = StyleSheet.create({
  "font-bold": {
    fontWeight: "700",
  },
  "text-blue-500": {
    color: "rgba(59, 130, 246, 1)",
  },
});

const __tailwindMedia = {};
