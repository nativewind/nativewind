import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test() {
  return (
    <_StyledComponent className="w-screen" component={Text}>
      Hello world!
    </_StyledComponent>
  );
}
_NativeWindStyleSheet.create({
  styles: {
    "w-screen": {
      width: 100,
    },
  },
  topics: {
    "w-screen": ["width"],
  },
  units: {
    "w-screen": {
      width: "vw",
    },
  },
});
