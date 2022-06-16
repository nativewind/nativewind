import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
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
globalThis.tailwindcss_react_native_style = Object.assign(
  globalThis.tailwindcss_react_native_style || {},
  RNStyleSheet.create({
    "font-bold.0": {
      fontWeight: "700",
    },
    "text-red-500.0": {
      color: "#ef4444",
    },
  })
);
globalThis.tailwindcss_react_native_media = Object.assign(
  globalThis.tailwindcss_react_native_media || {},
  {}
);
