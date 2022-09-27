import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <View>
      <_StyledComponent className="rotate-45 translate-x-px" component={Text}>
        Hello world!
      </_StyledComponent>
    </View>
  );
}

_NativeWindStyleSheet.create({
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
