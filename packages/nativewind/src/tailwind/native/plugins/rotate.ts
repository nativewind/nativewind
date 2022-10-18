import plugin from "tailwindcss/plugin";

export const rotate = plugin(function ({ matchUtilities, theme }) {
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
});
