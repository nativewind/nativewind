import { CustomPluginFunction } from "./types";

export const space: CustomPluginFunction = ({
  matchUtilities,
  theme,
  addUtilities,
}) => {
  matchUtilities(
    {
      "space-x": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&": {
            "@media --general-sibling-combinator": {
              "--tw-space-x-reverse": "0",
              "margin-right": `calc(${value} * var(--tw-space-x-reverse))`,
              "margin-left": `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
            },
          },
        };
      },
      "space-y": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&": {
            "@media --general-sibling-combinator": {
              "--tw-space-y-reverse": "0",
              "margin-top": `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
              "margin-bottom": `calc(${value} * var(--tw-space-y-reverse))`,
            },
          },
        };
      },
    },
    { values: theme("space"), supportsNegativeValues: true }
  );

  addUtilities({
    ".space-y-reverse": {
      "@media --general-sibling-combinator": {
        "--tw-space-y-reverse": "1",
      },
    },
    ".space-x-reverse": {
      "@media --general-sibling-combinator": {
        "--tw-space-x-reverse": "1",
      },
    },
  });
};
