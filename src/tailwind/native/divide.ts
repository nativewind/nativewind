import { CustomPluginFunction } from "./types";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export const divide: CustomPluginFunction = ({
  matchUtilities,
  theme,
  addUtilities,
}) => {
  matchUtilities(
    {
      "divide-x": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&": {
            "@selector (> * + *)": {
              "border-right-width": value,
              "border-left-width": value,
            },
          },
        };
      },
      "divide-y": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&": {
            "@selector (> * + *)": {
              "border-top-width": value,
              "border-bottom-width": value,
            },
          },
        };
      },
    },
    { values: theme("divideWidth"), type: ["line-width", "length"] }
  );

  matchUtilities(
    {
      divide: (value: string) => {
        return {
          "&": {
            "@selector (> * + *)": {
              "border-color": toColorValue(value),
            },
          },
        };
      },
    },
    {
      values: (({ DEFAULT: _, ...colors }) => colors)(
        flattenColorPalette(theme("divideColor"))
      ),
      type: "color",
    }
  );

  addUtilities({
    ".divide-solid": {
      "@selector (> * + *)": {
        "border-style": "solid",
      },
    },
    ".divide-dashed": {
      "@selector (> * + *)": {
        "border-style": "dashed",
      },
    },
    ".divide-dotted": {
      "@selector (> * + *)": {
        "border-style": "dotted",
      },
    },
    ".divide-double": {
      "@selector (> * + *)": {
        "border-style": "double",
      },
    },
    ".divide-none": {
      "@selector (> * + *)": {
        "border-style": "none",
      },
    },
  });
};
