import { NativeWindStyleSheet } from "nativewind";
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
NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
    underline: {
      textDecorationLine: "underline",
    },
  },
});
