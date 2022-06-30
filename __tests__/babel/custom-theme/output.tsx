import { NativeWindStyleSheet } from "nativewind";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test() {
  return (
    <StyledComponent className="p-px text-blue-500" component={Text}>
      Hello world!
    </StyledComponent>
  );
}
NativeWindStyleSheet.create({
  styles: {
    "p-px": {
      paddingTop: NativeWindStyleSheet.parse("roundToNearestPixel", "4"),
      paddingRight: NativeWindStyleSheet.parse("roundToNearestPixel", "4"),
      paddingBottom: NativeWindStyleSheet.parse("roundToNearestPixel", "4"),
      paddingLeft: NativeWindStyleSheet.parse("roundToNearestPixel", "4"),
    },
    "text-blue-500": {
      color: NativeWindStyleSheet.parse(
        "platform",
        "ios:platformColor(systemTealColor) android:platformColor(@android:color/holo_blue_bright) default:black"
      ),
    },
  },
});
