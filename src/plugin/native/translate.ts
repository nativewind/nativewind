import { CustomPluginFunction } from "./types";

export const translate: CustomPluginFunction = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      translate(value: string) {
        return {
          transform: `translate(${value}, ${value})`,
        };
      },
      "translate-x"(value: string) {
        return {
          transform: `translate(${value})`,
        };
      },
      "translate-y"(value: string) {
        return {
          transform: `translate(0, ${value})`,
        };
      },
    },
    {
      values: theme("translate"),
      supportsNegativeValues: true,
    }
  );
};
