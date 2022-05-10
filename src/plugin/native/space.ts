import { CustomPluginFunction } from "./types";

export const space: CustomPluginFunction = (
  { matchUtilities, theme },
  notSupported
) => {
  matchUtilities(
    {
      "space-x": (value: string) => {
        if (value === "reverse") {
          return notSupported("space-x-reverse")();
        }

        value = value === "0" ? "0px" : value;

        return {
          "&": {
            "@media --general-sibling-combinator": {
              "margin-left": value,
            },
          },
        };
      },
      "space-y": (value: string) => {
        if (value === "reverse") {
          return notSupported("space-y-reverse")();
        }

        value = value === "0" ? "0px" : value;

        return {
          "&": {
            "@media --general-sibling-combinator": {
              "margin-top": value,
            },
          },
        };
      },
    },
    { values: { ...theme("space"), reverse: "reverse" } }
  );
};
