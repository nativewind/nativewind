import { CustomPluginFunction } from "./types";
import { flattenColorPalette } from "./utils";

export const divide: CustomPluginFunction = (
  { matchUtilities, theme },
  notSupported
) => {
  matchUtilities(
    {
      "divide-x": notSupported("divide-x"),
      "divide-y": notSupported("divide-y"),
    },
    {
      values: { ...theme("space"), reverse: 0 },
      supportsNegativeValues: true,
    }
  );

  matchUtilities(
    {
      divide: notSupported("divide"),
    },
    {
      values: flattenColorPalette(theme("divideColor")),
      type: "color",
    }
  );

  matchUtilities(
    {
      "divide-opacity": notSupported("divide-opacity"),
    },
    { values: theme("divideOpacity") }
  );

  matchUtilities(
    {
      divide: notSupported("divide-style"),
    },
    {
      values: {
        solid: "solid",
        dashed: "dashed",
        dotted: "dotted",
        double: "double",
        none: "none",
      },
    }
  );
};
