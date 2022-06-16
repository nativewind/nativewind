import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { MotiText } from "moti";
import { TestComponent } from "./test";
export function Test() {
  return (
    <TailwindProvider>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <MotiText className="font-bold">Not in allowModuleTransform</MotiText>
      <TestComponent className="font-bold">
        Not in allowModuleTransform
      </TestComponent>
    </TailwindProvider>
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
