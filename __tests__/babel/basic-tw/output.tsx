import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <StyledComponent tw="container" component={View}>
      <StyledComponent tw="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
    </StyledComponent>
  );
}
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    container: {
      width: "100%",
    },
    "container@0": {
      maxWidth: 640,
    },
    "container@1": {
      maxWidth: 768,
    },
    "container@2": {
      maxWidth: 1024,
    },
    "container@3": {
      maxWidth: 1280,
    },
    "container@4": {
      maxWidth: 1536,
    },
    "font-bold": {
      fontWeight: "700",
    },
  })
);
globalThis.nativewind_at_rules = Object.assign(
  globalThis.nativewind_at_rules || {},
  {
    container: [
      [["media", "(min-width: 640px)"]],
      [["media", "(min-width: 768px)"]],
      [["media", "(min-width: 1024px)"]],
      [["media", "(min-width: 1280px)"]],
      [["media", "(min-width: 1536px)"]],
    ],
  }
);
globalThis.nativewind_topics = Object.assign(
  globalThis.nativewind_topics || {},
  {
    container: ["width"],
  }
);
