import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <View>
      <_StyledComponent className="text-hairline text-custom" component={Text}>
        Hello world!
      </_StyledComponent>
    </View>
  );
}

_NativeWindStyleSheet.create({
  styles: {
    "text-hairline": {
      fontSize: _NativeWindStyleSheet.parse("hairlineWidth", ""),
    },
    "text-custom": {
      fontSize: _NativeWindStyleSheet.parse(
        "roundToNearestPixel",
        _NativeWindStyleSheet.parse("hairlineWidth", "")
      ),
    },
  },
});
