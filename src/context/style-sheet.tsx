import { createContext, useContext } from "react";
import { MediaRecord, Style } from "../types/common";

declare global {
  // eslint-disable-next-line no-var
  var tailwindcss_react_native_style: Record<string, Style>;
  // eslint-disable-next-line no-var
  var tailwindcss_react_native_media: MediaRecord;
}

globalThis.tailwindcss_react_native_style ??= {};
globalThis.tailwindcss_react_native_media ??= {};

export interface StyleSheetContext {
  styles: typeof globalThis["tailwindcss_react_native_style"];
  media: typeof globalThis["tailwindcss_react_native_media"];
}

export const StyleSheetContext = createContext<StyleSheetContext>({
  styles: {},
  media: {},
});

export function useStyleSheet() {
  return useContext(StyleSheetContext);
}
