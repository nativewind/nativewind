import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export const boxShadowColor = plugin(function ({ matchUtilities, theme }) {
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
});
