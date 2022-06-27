import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
import { TestComponent } from "./test-directory";
export function Test() {
  return (
    <>
      <StyledComponent className="font-bold" component={Text}>
        Hello world!
      </StyledComponent>
      <StyledComponent className="text-blue-500" component={TestComponent} />
    </>
  );
}
NativeWindStyleSheet.create({
  styles: {
    "font-bold": {
      fontWeight: "700",
    },
    "text-blue-500": {
      color: "#3b82f6",
    },
  },
});
