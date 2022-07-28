import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

import { CustomPluginFunction } from "./types";

export const boxShadowColor: CustomPluginFunction = ({
  matchUtilities,
  theme,
}) => {
  matchUtilities(
    {
      shadow: (value: unknown) => {
        return {
          shadowColor: toColorValue(value),
        };
      },
    },
    { values: flattenColorPalette(theme("boxShadowColor")), type: ["color"] }
  );
};
