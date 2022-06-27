import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test() {
  return (
    <StyledComponent className="w-screen" component={Text}>
      Hello world!
    </StyledComponent>
  );
}
NativeWindStyleSheet.create({
  styles: {
    "w-screen@0": {
      width: 100,
    },
  },
  atRules: {
    "w-screen": [[["dynamic-style", "vw"]]],
  },
  topics: {
    "w-screen": ["width"],
  },
});
