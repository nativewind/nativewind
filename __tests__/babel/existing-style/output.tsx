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
globalThis.tailwindcss_react_native_style = Object.assign(
  globalThis.tailwindcss_react_native_style || {},
  RNStyleSheet.create({
    "font-bold.0": {
      fontWeight: "700",
    },
  })
);
globalThis.tailwindcss_react_native_media = Object.assign(
  globalThis.tailwindcss_react_native_media || {},
  {}
);
