import { CustomPluginFunction } from "./types";

export const scale: CustomPluginFunction = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      scale(value: string) {
        return {
          transform: `scale(${value}, ${value})`,
        };
      },
      "scale-x"(value: string) {
        return {
          transform: `scaleX(${value})`,
        };
      },
      "scale-y"(value: string) {
        return {
          transform: `scaleY(${value})`,
        };
      },
    },
    {
      values: theme("scale"),
      supportsNegativeValues: true,
    }
  );
};
