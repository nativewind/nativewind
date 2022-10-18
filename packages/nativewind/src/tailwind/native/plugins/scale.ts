import plugin from "tailwindcss/plugin";

export const scale = plugin(function ({ matchUtilities, theme }) {
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
});
