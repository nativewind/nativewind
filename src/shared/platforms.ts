import { Platform } from "react-native";

type Platform = typeof Platform.OS | "native";

export const platforms: Platform[] = [
  "android",
  "ios",
  "web",
  "native",
  "windows",
  "macos",
];

export const nativePlatforms: Platform[] = [
  "native",
  "android",
  "ios",
  "windows",
  "macos",
];
