import plugin from "tailwindcss/plugin";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

export default plugin(function ({ addVariant, matchUtilities, theme }) {
  addVariant("web", "&");
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
