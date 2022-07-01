import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";
import { CustomPluginFunction } from "./types";

export const color: CustomPluginFunction = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      color: (value: string) => {
        return { color: toColorValue(value) };
      },
    },
    { values: flattenColorPalette(theme("textColor")), type: "color" }
  );
};
