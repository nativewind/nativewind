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
