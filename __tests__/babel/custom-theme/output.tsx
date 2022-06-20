import { NWRuntimeParser } from "nativewind";
import { StyleSheet as RNStyleSheet } from "react-native";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test() {
  return (
    <StyledComponent className="p-px text-blue-500" component={Text}>
      Hello world!
    </StyledComponent>
  );
}
globalThis.nativewind_styles = Object.assign(
  globalThis.nativewind_styles || {},
  RNStyleSheet.create({
    "p-px": {
      paddingTop: NWRuntimeParser("roundToNearestPixel(4)"),
      paddingRight: NWRuntimeParser("roundToNearestPixel(4)"),
      paddingBottom: NWRuntimeParser("roundToNearestPixel(4)"),
      paddingLeft: NWRuntimeParser("roundToNearestPixel(4)"),
    },
    "text-blue-500": {
      color: NWRuntimeParser(
        "platform(ios:platformColor(systemTealColor) android:platformColor(@android:color/holo_blue_bright) default:black)"
      ),
    },
  })
);
