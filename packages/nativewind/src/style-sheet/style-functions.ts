import { PixelRatio } from "react-native";

export function getFontSizeForLayoutSize(layoutSize: number) {
  return Math.round(layoutSize * PixelRatio.getFontScale());
}

// export function roundToNearestFontScale(layoutSize: number) {
//   const ratio = PixelRatio.getFontScale();
//   return Math.round(layoutSize * ratio) / ratio;
// }

// function platformColor(color: string) {
//   // RWN does not implement PlatformColor
//   // https://github.com/necolas/react-native-web/issues/2128
//   return PlatformColor ? PlatformColor(color) : color;
// }

// function platform(platformValues: string) {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const specifics: any = Object.fromEntries(
//     platformValues
//       .trim()
//       .split(/\s+/)
//       .map((platformValue) => {
//         // Edge case:
//         //   platform(android:platformColor(@android:color/holo_blue_bright))
//         // Sometimes the value can has a colon, so we need to collect all values
//         // and join them
//         let [platform, ...tokens] = platformValue.split(":");

//         if (!tokens) {
//           tokens = [platform];
//           platform = "default";
//         }

//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//         let value: any = tokens.join("");
//         const numberValue = Number.parseFloat(value);

//         value = Number.isFinite(numberValue) ? numberValue : parseString(value);

//         return [platform, value];
//       })
//   );

//   return Platform.select(specifics);
// }
