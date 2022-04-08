import { StyleSheet } from "react-native";
import { useTailwind } from "tailwindcss-react-native";
import { Text } from "react-native";
import { ShouldNotBeTransformed } from "module-not-in-allow-list";
import { TailwindProvider } from "../../../src";
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
      <ShouldNotBeTransformed className="font-bold">
        Should be the untransformed
      </ShouldNotBeTransformed>
      <ShouldNotBeTransformed.A className="font-bold">
        Should be the untransformed
      </ShouldNotBeTransformed.A>
    </TailwindProvider>
  );
}

const __tailwindStyles = StyleSheet.create({
  "font-bold": {
    fontWeight: "700",
  },
});

const __tailwindMedia = {};
