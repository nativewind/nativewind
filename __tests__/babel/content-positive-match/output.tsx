import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
import { TestComponent } from "./test";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <StyledComponent className="text-red-500" component={TestComponent} />
    </>
  );
}
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
    "text-red-500": {
      color: "#ef4444",
    },
  })
);
