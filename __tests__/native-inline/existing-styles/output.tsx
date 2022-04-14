import { useTailwind } from "tailwindcss-react-native";
import { Text, StyleSheet } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
export function Test() {
  return (
    <TailwindProvider>
      <Text
        style={[
          useTailwind("font-bold", {
            styles: __tailwindStyles,
            media: __tailwindMedia,
          }),
          styles.test,
          styles.test2,
        ]}
      >
        Hello world!
      </Text>
    </TailwindProvider>
  );
}
const styles = StyleSheet.create({
  test: {
    color: "blue",
  },
  test2: {
    color: "red",
  },
});

const __tailwindStyles = StyleSheet.create({
  "font-bold": {
    fontWeight: "700",
  },
});

const __tailwindMedia = {};
