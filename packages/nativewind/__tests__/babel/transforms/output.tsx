import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <View>
      <StyledComponent className="rotate-45 translate-x-px" component={Text}>
        Hello world!
      </StyledComponent>
    </View>
  );
}
NativeWindStyleSheet.create({
  styles: {
    "rotate-45": {
      transform: [
        {
          rotate: "45deg",
        },
      ],
    },
    "translate-x-px": {
      transform: [
        {
          translateY: 0,
        },
        {
          translateX: 1,
        },
      ],
    },
  },
  transforms: {
    "rotate-45": true,
    "translate-x-px": true,
  },
});
