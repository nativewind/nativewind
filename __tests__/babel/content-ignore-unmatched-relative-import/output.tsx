import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
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
