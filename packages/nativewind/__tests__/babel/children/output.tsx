import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <_StyledComponent className="divide-y" component={View}>
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
    "divide-y.children@0": {
      borderBottomWidth: 0,
      borderTopWidth: _NativeWindStyleSheet.hairlineWidth(),
    },
  },
  atRules: {
    "divide-y.children": [[["selector", "(> *:not(:first-child))"]]],
  },
  childClasses: {
    "divide-y": ["divide-y.children"],
  },
});
