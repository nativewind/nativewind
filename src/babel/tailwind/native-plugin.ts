import plugin from "tailwindcss/plugin";

export const nativePlugin = plugin(function ({
  addVariant,
  matchUtilities,
  theme,
}) {
  addVariant("native", "@media native");
  addVariant("ios", "");
  addVariant("android", "");

  matchUtilities(
    {
      aspect: (value: string) => {
        let aspectRatio = value;

        if (value.includes("/")) {
          const [left, right] = value.split("/").map((n) => {
            return Number.parseInt(n, 10);
          });

          aspectRatio = `${left / right}`;
        }

        return {
          aspectRatio,
        };
      },
    },
    { values: theme("aspectRatio") }
  );
});
