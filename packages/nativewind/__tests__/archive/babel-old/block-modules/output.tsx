import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text } from "react-native";
import { MotiText } from "moti";
export function Test() {
  return (
    <>
      <_StyledComponent className="font-bold" component={Text}>
        Hello world!
      </_StyledComponent>
      <MotiText className="font-bold">Should be the untransformed</MotiText>
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
