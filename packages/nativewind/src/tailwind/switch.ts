import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import withAlphaVariable from "tailwindcss/lib/util/withAlphaVariable";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export const nativeSwitch = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      thumb: (value) => {
        return {
          "&:native-prop(thumbColor,caretColor)": {
            "caret-color": toColorValue(value),
          },
        };
      },
    },
    {
      values: flattenColorPalette(theme("trackColor")),
      type: ["color", "any"],
    },
  );
});

export const webSwitch = plugin(function ({
  matchUtilities,
  theme,
  corePlugins,
}) {
  matchUtilities(
    {
      thumb: (value) => {
        if (!corePlugins("backgroundOpacity")) {
          return {
            '& > [style*="margin-left: -20"]': {
              backgroundColor: toColorValue(value) + " !important",
            },
          };
        }

        const output = withAlphaVariable({
          color: value,
          property: "background-color",
          variable: "--tw-bg-opacity",
        });

        output["background-color"] += " !important";

        return {
          '& > [style*="margin-left: -20"]': output,
        };
      },
    },
    {
      values: flattenColorPalette(theme("trackColor")),
      type: ["color", "any"],
    },
  );
});
