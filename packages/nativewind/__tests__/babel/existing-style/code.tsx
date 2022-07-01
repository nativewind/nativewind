import { StyleSheet, Text } from "react-native";

export function Test() {
  return (
    <Text className="font-bold" style={styles.test}>
      Hello world!
    </Text>
  );
}

const styles = StyleSheet.create({
  test: { color: "blue" },
});
