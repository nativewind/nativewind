import { CustomPluginFunction } from "./types";
import withAlphaVariable from "tailwindcss/lib/util/withAlphaVariable";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export const divide: CustomPluginFunction = ({
  matchUtilities,
  theme,
  addUtilities,
  ...other
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { corePlugins } = other as any;

  matchUtilities(
    {
      "divide-x": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&": {
            "@media --general-sibling-combinator": {
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
            "@media --general-sibling-combinator": {
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
        if (!corePlugins("divideOpacity")) {
          return {
            "&": {
              "@media --general-sibling-combinator": {
                "border-color": toColorValue(value),
              },
            },
          };
        }

        return {
          "&": {
            "@media --general-sibling-combinator": withAlphaVariable({
              color: value,
              property: "border-color",
              variable: "--tw-divide-opacity",
            }),
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
      "@media --general-sibling-combinator": {
        "border-style": "solid",
      },
    },
    ".divide-dashed": {
      "@media --general-sibling-combinator": {
        "border-style": "dashed",
      },
    },
    ".divide-dotted": {
      "@media --general-sibling-combinator": {
        "border-style": "dotted",
      },
    },
    ".divide-double": {
      "@media --general-sibling-combinator": {
        "border-style": "double",
      },
    },
    ".divide-none": {
      "@media --general-sibling-combinator": {
        "border-style": "none",
      },
    },
  });
};
