import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
import { MotiText } from "moti";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <MotiText className="font-bold">Should be the untransformed</MotiText>
    </>
  );
}
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
  })
);
