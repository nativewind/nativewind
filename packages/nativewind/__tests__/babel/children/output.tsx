import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <_StyledComponent className="divide-y-0.5" component={View}>
      <_StyledComponent className="font-bold" component={Text}>
        Hello world!
      </_StyledComponent>
      <_StyledComponent className="font-bold" component={Text}>
        Hello world!
      </_StyledComponent>
    </_StyledComponent>
  );
}
_NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
    "divide-y-0.5.children@0": {
      borderBottomWidth: 0,
      borderTopWidth: _NativeWindStyleSheet.hairlineWidth(),
    },
    "divide-y-0.children@0": {
      borderBottomWidth: 0,
      borderTopWidth: 0,
    },
  },
  atRules: {
    "divide-y-0.5.children": [[["selector", "(> *:not(:first-child))"]]],
    "divide-y-0.children": [[["selector", "(> *:not(:first-child))"]]],
  },
  childClasses: {
    "divide-y-0.5": ["divide-y-0.5.children"],
    "divide-y-0": ["divide-y-0.children"],
  },
});
