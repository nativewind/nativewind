import { CustomPluginFunction } from "./types";

export const rotate: CustomPluginFunction = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      rotate(value: string) {
        return {
          transform: `rotate(${value})`,
        };
      },
    },
    {
      values: theme("rotate"),
      supportsNegativeValues: true,
    }
  );
};
