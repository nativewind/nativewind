import { StyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TestComponent } from "./test-directory";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <StyledComponent className="text-blue-500" component={TestComponent} />
    </>
  );
}
Object.assign(
  globalThis.tailwindcss_react_native_style,
  StyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
    "text-blue-500": {
      color: "#3b82f6",
    },
  })
);
Object.assign(globalThis.tailwindcss_react_native_media, {});
