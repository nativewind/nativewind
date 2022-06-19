import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test() {
  return (
    <StyledComponent className="w-screen" component={Text}>
      Hello world!
    </StyledComponent>
  );
}
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    "w-screen@0": {
      width: 100,
    },
  })
);
globalThis.nativewind_at_rules = Object.assign(
  globalThis.nativewind_at_rules || {},
  {
    "w-screen": [[["dynamic-style", "vw"]]],
  }
);
globalThis.nativewind_topics = Object.assign(
  globalThis.nativewind_topics || {},
  {
    "w-screen": ["width"],
  }
);
