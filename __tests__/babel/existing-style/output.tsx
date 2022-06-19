import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { StyleSheet, Text } from "react-native";
export function Test() {
  return (
    <StyledComponent className="font-bold" style={styles.test} component={Text}>
      Hello world!
    </StyledComponent>
  );
}
const styles = StyleSheet.create({
  test: {
    color: "blue",
  },
});
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
  })
);
