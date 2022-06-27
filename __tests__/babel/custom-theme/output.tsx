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
      paddingTop: "roundToNearestPixel(4)",
      paddingRight: "roundToNearestPixel(4)",
      paddingBottom: "roundToNearestPixel(4)",
      paddingLeft: "roundToNearestPixel(4)",
    },
    "text-blue-500": {
      color:
        "platform(ios:platformColor(systemTealColor) android:platformColor(@android:color/holo_blue_bright) default:black)",
    },
  },
});
