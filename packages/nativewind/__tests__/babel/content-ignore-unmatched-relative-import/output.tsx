import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text } from "react-native";
import { ShouldNotBeTransformed } from "./should-not-be-transformed";
export function Test() {
  return (
    <>
      <_StyledComponent className="font-bold" component={Text}>
        Hello world!
      </_StyledComponent>
      <ShouldNotBeTransformed className="font-bold" />
    </>
  );
}

_NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
  },
});
