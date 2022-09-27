import plugin from "tailwindcss/plugin";

export const space = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "space-x": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&:merge(:parent)": {},
          ":merge(.children)&:not-first-child": {
            "margin-left": value,
          },
        };
      },
      "space-y": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&:merge(:parent)": {},
          "&:merge(:children):not-first-child": {
            "margin-top": value,
          },
        };
      },
    },
    { values: theme("space") }
  );
});
