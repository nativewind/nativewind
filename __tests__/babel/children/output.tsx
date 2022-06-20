import { NWRuntimeParser } from "nativewind";
import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <StyledComponent className="divide-y" component={View}>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
    </StyledComponent>
  );
}
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    "font-bold": {
      fontWeight: "700",
    },
    "divide-y.children@0": {
      borderBottomWidth: 0,
      borderTopWidth: NWRuntimeParser("styleSheet(hairlineWidth)"),
    },
  })
);
globalThis.nativewind_at_rules = Object.assign(
  globalThis.nativewind_at_rules || {},
  {
    "divide-y.children": [[["selector", "(> *:not(:first-child))"]]],
  }
);
globalThis.nativewind_child_classes = Object.assign(
  globalThis.nativewind_child_classes || {},
  {
    "divide-y": ["divide-y.children"],
  }
);
