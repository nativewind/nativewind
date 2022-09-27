import plugin from "tailwindcss/plugin";

export const elevation = plugin(function ({ matchUtilities, theme }) {
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
});
