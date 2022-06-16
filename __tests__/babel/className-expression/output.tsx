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
globalThis.tailwindcss_react_native_style = Object.assign(
  globalThis.tailwindcss_react_native_style || {},
  RNStyleSheet.create({
    "font-bold.0": {
      fontWeight: "700",
    },
    "underline.0": {
      textDecorationLine: "underline",
    },
  })
);
globalThis.tailwindcss_react_native_media = Object.assign(
  globalThis.tailwindcss_react_native_media || {},
  {}
);
