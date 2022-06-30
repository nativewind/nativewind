import { NativeWindStyleSheet } from "nativewind";
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
NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
    "divide-y.children@0": {
      borderBottomWidth: 0,
      borderTopWidth: NativeWindStyleSheet.parse("hairlineWidth", ""),
    },
  },
  atRules: {
    "divide-y.children": [[["selector", "(> *:not(:first-child))"]]],
  },
  childClasses: {
    "divide-y": ["divide-y.children"],
  },
});
