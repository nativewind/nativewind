import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import { platforms, nativePlatforms } from "../shared/platforms";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export default plugin(function ({ addVariant, matchUtilities, theme }) {
  for (const platform of platforms) {
    addVariant(platform, `&::${platform}`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `&::${platform}`)
  );

  addVariant("parent", "& > *");
  addVariant("group-isolate-hover", "&.group-isolate-hover");
  addVariant("group-isolate-focus", "&.group-isolate-focus");
  addVariant("group-isolate-active", "&.group-isolate-active");

  matchUtilities(
    {
      color: (value: string) => {
        return { color: toColorValue(value) };
      },
    },
    { values: flattenColorPalette(theme("textColor")), type: "color" }
  );
});
