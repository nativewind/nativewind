import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export const nativeFill = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      fill: (value) => ({
        "&:native-prop(fill)": {
          fill: toColorValue(value),
        },
      }),
    },
    { values: flattenColorPalette(theme("fill")), type: ["color", "any"] },
  );
});

export const nativeStroke = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      stroke: (value) => ({
        "&:native-prop(stroke)": {
          stroke: toColorValue(value),
        },
      }),
    },
    { values: flattenColorPalette(theme("stroke")), type: ["color", "any"] },
  );
});

export const nativeStrokeWidth = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      stroke: (value) => ({
        "&:native-prop(strokeWidth)": {
          strokeWidth: toColorValue(value),
        },
      }),
    },
    { values: theme("strokeWidth"), type: ["length", "number", "percentage"] },
  );
});
