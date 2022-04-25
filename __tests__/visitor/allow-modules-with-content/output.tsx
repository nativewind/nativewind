import { StyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
import { MotiText } from "moti";
import { TestComponent } from "./test";
export function Test() {
  return (
    <TailwindProvider platform="native">
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <MotiText className="font-bold">Do not transform</MotiText>
      <TestComponent className="font-bold">Do not transform</TestComponent>
    </TailwindProvider>
  );
}
Object.assign(
  globalThis.tailwindcss_react_native_style,
  StyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
  })
);
Object.assign(globalThis.tailwindcss_react_native_media, {});
