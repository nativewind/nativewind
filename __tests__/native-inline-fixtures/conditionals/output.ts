import { StyleSheet } from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "../../../src";
export function Test({ isBold, isUnderline }) {
  const classNames = [];
  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");
  return (
    <TailwindProvider>
      <Text
        style={useTailwind(classNames.join(" "), {
          styles: __tailwindStyles,
          media: __tailwindMedia,
        })}
      >
        Hello world!
      </Text>
    </TailwindProvider>
  );
}

const __tailwindStyles = StyleSheet.create({
  "font-bold": {
    fontWeight: "700",
  },
  underline: {
    textDecorationLine: "underline",
  },
});

const __tailwindMedia = {};
