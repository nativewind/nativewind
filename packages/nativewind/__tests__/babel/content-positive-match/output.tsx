import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text } from "react-native";
import { TestComponent } from "./test";
export function Test() {
  return (
    <>
      <_StyledComponent className="font-bold" component={Text}>
        Hello world!
      </_StyledComponent>
      <_StyledComponent
        className="text-red-500"
        component={TestComponent}
      ></_StyledComponent>
    </>
  );
}

_NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
    "text-red-500": {
      color: "#ef4444",
    },
  },
});
