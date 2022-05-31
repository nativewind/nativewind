import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
export function Test({ isBold, isUnderline }) {
  const classNames = [];
  if (isBold) classNames.push("font-bold");
  if (isUnderline) classNames.push("underline");
  return (
    <TailwindProvider>
      <StyledComponent className={classNames.join(" ")} component={Text}>
        Hello world!
      </StyledComponent>
    </TailwindProvider>
  );
}
globalThis.tailwindcss_react_native_style = Object.assign(
  globalThis.tailwindcss_react_native_style || {},
  RNStyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
    underline: {
      textDecorationLine: "underline",
    },
  })
);
globalThis.tailwindcss_react_native_media = Object.assign(
  globalThis.tailwindcss_react_native_media || {},
  {}
);
