import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";
import withAlphaVariable from "tailwindcss/lib/util/withAlphaVariable";

export const nativePlaceholder = plugin(function ({
  addVariant,
  corePlugins,
  matchUtilities,
  theme,
}) {
  addVariant("placeholder", `&:native-prop(color,placeholderTextColor)`);

  matchUtilities(
    {
      placeholder: (value) => {
        if (!corePlugins("placeholderOpacity")) {
          return {
            "&:native-prop(color,placeholderTextColor)": {
              color: toColorValue(value),
            },
          };
        }
        return {
          "&:native-prop(color,placeholderTextColor)": withAlphaVariable({
            color: value,
            property: "color",
            variable: "--tw-placeholder-opacity",
          }),
        };
      },
    },
    {
      values: flattenColorPalette(theme("placeholderColor")),
      type: ["color", "any"],
    },
  );
});
