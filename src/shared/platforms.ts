import { Platform } from "react-native";

export type Platform = typeof Platform.OS | "native";

export const platforms: Platform[] = [
  "android",
  "ios",
  "web",
  "native",
  "windows",
  "macos",
];

export const nativePlatforms: Platform[] = [
  "android",
  "ios",
  "windows",
  "macos",
];
