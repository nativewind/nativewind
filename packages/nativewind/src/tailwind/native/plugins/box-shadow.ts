/* eslint-disable @typescript-eslint/no-explicit-any */
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";
import plugin from "tailwindcss/plugin";
import { CSSRuleObject } from "tailwindcss/types/config";

export const boxShadow = plugin(function ({
  addComponents,
  theme,
  matchUtilities,
}) {
  const themeValues = Object.entries(
    theme("boxShadow") as Record<string, string>
  );

  const elevation = theme("elevation") as Record<string, number>;

  const components: CSSRuleObject[] = [];

  for (const [size, value] of themeValues) {
    components.push({
      [key(size)]: {
        elevation: elevation[size] as any,
        boxShadow: value,
      } as CSSRuleObject,
    });
  }

  addComponents(components);

  matchUtilities(
    {
      shadow: (value) => {
        return {
          shadowColor: toColorValue(value),
        };
      },
    },
    {
      values: flattenColorPalette(theme("boxShadowColor")),
      type: ["color", "any"],
    }
  );
});

function key(size: string) {
  return size === "DEFAULT" ? ".shadow" : `.shadow-${size}`;
}
