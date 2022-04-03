import { Text } from "react-native";
import { TailwindProvider } from "../../../src";

export function Test() {
  return (
    <TailwindProvider>
      <Text className="font-bold" style={[styles.test, styles.test2]}>
        Hello world!
      </Text>
    </TailwindProvider>
  );
}

const styles = StyleSheet.create({
  test: { color: "blue" },
  test2: { color: "blue" },
});
