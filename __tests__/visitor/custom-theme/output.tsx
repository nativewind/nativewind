import {
  StyleSheet as RNStyleSheet,
  Platform as RNPlatform,
  PlatformColor as RNPlatformColor,
} from "react-native";
import { StyledComponent } from "tailwindcss-react-native";
import { Text } from "react-native";
import { TailwindProvider } from "tailwindcss-react-native";
export function Test() {
  return (
    <TailwindProvider>
      <StyledComponent className="text-blue-500" component={Text}>
        Hello world!
      </StyledComponent>
    </TailwindProvider>
  );
}
globalThis.tailwindcss_react_native_style = Object.assign(
  globalThis.tailwindcss_react_native_style || {},
  RNStyleSheet.create({
    "text-blue-500": {
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
