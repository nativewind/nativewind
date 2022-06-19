import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test({ isBold, isUnderline }) {
  const classNames = [];
  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");
  return (
    <StyledComponent className={classNames.join(" ")} component={Text}>
      Hello world!
    </StyledComponent>
  );
}
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
    underline: {
      textDecorationLine: "underline",
    },
  })
);
