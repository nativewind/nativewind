import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
import { ShouldNotBeTransformed } from "./should-not-be-transformed";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <ShouldNotBeTransformed className="font-bold" />
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
