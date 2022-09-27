import plugin from "tailwindcss/plugin";

export const gap = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      gap: (value: string) => {
        value = value === "0" ? "0px" : value;
        value = value === "px" ? "1px" : value;

        return {
          "&": {
            marginLeft: `-${value}`,
            marginTop: `-${value}`,
          },
          "&:children": {
            marginLeft: value,
            marginTop: value,
          },
        };
      },
      "gap-x": (value: string) => {
        value = value === "0" ? "0px" : value;
        value = value === "px" ? "1px" : value;

        return {
          "&": {
            "margin-left": `-${value}`,
          },
          "&:children": {
            "margin-left": value,
          },
        };
      },
      "gap-y": (value: string) => {
        value = value === "0" ? "0px" : value;
        value = value === "px" ? "1px" : value;

        return {
          "&": {
            "margin-top": `-${value}`,
          },
          "&:children": {
            "margin-top": value,
          },
        };
      },
    },
    { values: theme("gap") }
  );
});
