import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
import { MotiText } from "moti";
import { TestComponent } from "./test";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <MotiText className="font-bold">Not in allowModuleTransform</MotiText>
      <TestComponent className="font-bold">
        Not in allowModuleTransform
      </TestComponent>
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
