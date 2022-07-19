import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";
import { Text, View } from "react-native";
export function Test() {
  return (
    <View>
      <StyledComponent className="text-hairline text-custom" component={Text}>
        Hello world!
      </StyledComponent>
    </View>
  );
}
NativeWindStyleSheet.create({
  styles: {
    "text-hairline": {
      fontSize: NativeWindStyleSheet.parse("hairlineWidth", ""),
    },
    "text-custom": {
      fontSize: NativeWindStyleSheet.parse(
        "roundToNearestPixel",
        NativeWindStyleSheet.parse("hairlineWidth", "")
      ),
    },
  },
});
