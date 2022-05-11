import { CustomPluginFunction } from "./types";

export const elevation: CustomPluginFunction = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      elevation(value: string) {
        return {
          elevation: value,
        };
      },
    },
    {
      values: theme("elevation"),
    }
  );
};
