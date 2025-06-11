import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";
import withAlphaVariable from "tailwindcss/lib/util/withAlphaVariable";
import plugin from "tailwindcss/plugin";

export const color = plugin(function ({ matchUtilities, corePlugins, theme }) {
  matchUtilities(
    {
      color: (value) => {
        if (!corePlugins("textOpacity")) {
          return { color: toColorValue(value) };
        }

        return withAlphaVariable({
          color: value,
          property: "color",
          variable: "--tw-text-opacity",
        });
      },
    },
    { values: flattenColorPalette(theme("textColor")), type: ["color", "any"] },
  );
});
