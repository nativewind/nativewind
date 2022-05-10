import { createContext } from "react";
import { ColorSchemeName } from "react-native";
import { MediaRecord, StyleRecord } from "./types/common";

declare global {
  // eslint-disable-next-line no-var
  var tailwindcss_react_native_style: StyleRecord;
  // eslint-disable-next-line no-var
  var tailwindcss_react_native_media: MediaRecord;
}

globalThis.tailwindcss_react_native_style ??= {};
globalThis.tailwindcss_react_native_media ??= {};

export interface TailwindContext {
  styles: StyleRecord;
  media: MediaRecord;
  colorScheme: ColorSchemeName;
  setColorScheme: (colorScheme: ColorSchemeName) => void;
  width: number;
  height: number;
  platform: string;
  preview: boolean;
  orientation: "portrait" | "landscape";
}

export const TailwindContext = createContext<TailwindContext>({
  styles: {},
  media: {},
  colorScheme: "light",
  setColorScheme: () => {
    return;
  },
  width: 0,
  height: 0,
  platform: "",
  orientation: "portrait",
  preview: false,
});
