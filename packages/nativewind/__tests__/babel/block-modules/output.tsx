import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
import { MotiText } from "moti";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <MotiText className="font-bold">Should be the untransformed</MotiText>
    </>
  );
}
NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
  },
});
