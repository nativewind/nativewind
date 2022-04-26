import { StyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text } from "react-native";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
    </>
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
