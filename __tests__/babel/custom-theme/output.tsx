import {
  StyleSheet as RNStyleSheet,
  Platform as RNPlatform,
  PlatformColor as RNPlatformColor,
  PixelRatio as RNPixelRatio,
} from "react-native";
import { StyledComponent } from "nativewind";
import { Text } from "react-native";
export function Test() {
  return (
    <StyledComponent className="p-px text-blue-500" component={Text}>
      Hello world!
    </StyledComponent>
  );
}
globalThis.tailwindcss_react_native_style = Object.assign(
  globalThis.tailwindcss_react_native_style || {},
  RNStyleSheet.create({
    "p-px.0": {
      paddingTop: RNPixelRatio.roundToNearestPixel(4),
      paddingRight: RNPixelRatio.roundToNearestPixel(4),
      paddingBottom: RNPixelRatio.roundToNearestPixel(4),
      paddingLeft: RNPixelRatio.roundToNearestPixel(4),
    },
    "text-blue-500.0": {
      color: RNPlatform.select({
        ios: RNPlatformColor("systemTealColor"),
        android: RNPlatformColor("@androidcolor/holo_blue_bright"),
        default: "black",
      }),
    },
  })
);
globalThis.tailwindcss_react_native_media = Object.assign(
  globalThis.tailwindcss_react_native_media || {},
  {}
);
