import { Platform } from "react-native";

export type Platform = typeof Platform.OS | "native" | "web-inline";

export const platforms: Platform[] = [
  "android",
  "ios",
  "web",
  "native",
  "windows",
  "macos",
  "web-inline",
];

export const nativePlatforms: Platform[] = [
  "native",
  "android",
  "ios",
  "windows",
  "macos",
];
