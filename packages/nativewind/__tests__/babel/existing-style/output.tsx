import { NativeWindStyleSheet } from "nativewind";
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
NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
  },
});
