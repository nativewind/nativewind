import { CustomPluginFunction } from "./types";

export const space: CustomPluginFunction = (
  { matchUtilities, theme },
  notSupported
) => {
  matchUtilities(
    {
      "space-x": notSupported("space-x"),
      "space-y": notSupported("space-y"),
    },
    {
      values: { ...theme("space"), reverse: 0 },
      supportsNegativeValues: true,
    }
  );
};
