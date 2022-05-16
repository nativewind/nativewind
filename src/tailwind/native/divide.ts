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
            "@selector (> *:not(:first-child))": {
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
            "@selector (> *:not(:first-child))": {
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
            "@selector (> *:not(:first-child))": {
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
      "@selector (> *:not(:first-child))": {
        "border-style": "solid",
      },
    },
    ".divide-dashed": {
      "@selector (> *:not(:first-child))": {
        "border-style": "dashed",
      },
    },
    ".divide-dotted": {
      "@selector (> *:not(:first-child))": {
        "border-style": "dotted",
      },
    },
    ".divide-double": {
      "@selector (> *:not(:first-child))": {
        "border-style": "double",
      },
    },
    ".divide-none": {
      "@selector (> *:not(:first-child))": {
        "border-style": "none",
      },
    },
  });
};
