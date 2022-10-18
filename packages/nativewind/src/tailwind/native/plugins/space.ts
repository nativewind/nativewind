import plugin from "tailwindcss/plugin";

export const space = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "space-x": (value: string) => {
        return {
          "&:children:not-first-child": {
            "margin-left": value,
          },
        };
      },
      "space-y": (value: string) => {
        return {
          "&:children:not-first-child": {
            "margin-right": value,
          },
        };
      },
    },
    { values: theme("space") }
  );
});
