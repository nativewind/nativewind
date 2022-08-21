import { CustomPluginFunction } from "./types";

export const gap: CustomPluginFunction = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      gap: (value: string) => {
        value = value === "0" ? "0px" : value;
        value = value === "px" ? "1px" : value;

        return {
          "&": {
            marginLeft: `-${value}`,
            marginTop: `-${value}`,
            "@selector (> *)": {
              marginLeft: value,
              marginTop: value,
            },
          },
        };
      },
      "gap-x": (value: string) => {
        value = value === "0" ? "0px" : value;
        value = value === "px" ? "1px" : value;

        return {
          "&": {
            "margin-left": `-${value}`,
            "@selector (> *)": {
              "margin-left": value,
            },
          },
        };
      },
      "gap-y": (value: string) => {
        value = value === "0" ? "0px" : value;
        value = value === "px" ? "1px" : value;

        return {
          "&": {
            "margin-top": `-${value}`,
            "@selector (> *)": {
              "margin-top": value,
            },
          },
        };
      },
    },
    { values: theme("gap") }
  );
};
