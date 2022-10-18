import plugin from "tailwindcss/plugin";

export const skew = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "skew-x"(value: string) {
        return {
          transform: `skewX(${value})`,
        };
      },
      "skew-y"(value: string) {
        return {
          transform: `skewY(${value})`,
        };
      },
    },
    {
      values: theme("skew"),
      supportsNegativeValues: true,
    }
  );
});
