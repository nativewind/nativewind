import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import { platforms, nativePlatforms } from "../shared/platforms";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export default plugin(function ({ addVariant, matchUtilities, theme }) {
  for (const platform of platforms) {
    addVariant(platform, `@media ${platform}`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `@media ${platform}`)
  );

  addVariant("parent", "& > *");
  addVariant("group-scoped-hover", "&.group-hover");
  addVariant("group-scoped-focus", "&.group-focus");
  addVariant("group-scoped-active", "&.group-active");

  matchUtilities(
    {
      color: (value: string) => {
        return { color: toColorValue(value) };
      },
    },
    { values: flattenColorPalette(theme("textColor")), type: "color" }
  );
});
