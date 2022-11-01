import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { StyleSheet, Text } from "react-native";
export function Test() {
  return (
    <_StyledComponent
      className="font-bold"
      style={styles.test}
      component={Text}
    >
      Hello world!
    </_StyledComponent>
  );
}
const styles = StyleSheet.create({
  test: {
    color: "blue",
  },
});
_NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
  },
});
