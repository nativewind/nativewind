import { NativeWindStyleSheet as _NativeWindStyleSheet } from "nativewind";
import { StyledComponent as _StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test() {
  return (
    <_StyledComponent className="p-px text-blue-500" component={Text}>
      Hello world!
    </_StyledComponent>
  );
}
_NativeWindStyleSheet.create({
  styles: {
    "p-px": {
      paddingTop: _NativeWindStyleSheet.roundToNearestPixel(4),
      paddingRight: _NativeWindStyleSheet.roundToNearestPixel(4),
      paddingBottom: _NativeWindStyleSheet.roundToNearestPixel(4),
      paddingLeft: _NativeWindStyleSheet.roundToNearestPixel(4),
    },
    "text-blue-500": {
      color: _NativeWindStyleSheet.platformSelect({
        ios: _NativeWindStyleSheet.platformColor("systemTealColor"),
        android: _NativeWindStyleSheet.platformColor(
          "@android:color/holo_blue_bright"
        ),
        default: "black",
      }),
    },
  },
});
