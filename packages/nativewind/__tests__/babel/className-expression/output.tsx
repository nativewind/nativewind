import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test({ isBold, isUnderline }) {
  const classNames = [];
  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");
  return (
    <_StyledComponent className={classNames.join(" ")} component={Text}>
      Hello world!
    </_StyledComponent>
  );
}

_NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
    underline: {
      textDecorationLine: "underline",
    },
  },
});
