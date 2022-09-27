/* eslint-disable @typescript-eslint/no-explicit-any */
import plugin from "tailwindcss/plugin";
import { CSSRuleObject } from "tailwindcss/types/config";

export const boxShadow = plugin(function ({ addComponents, theme }) {
  const themeValues = Object.entries(
    theme("boxShadow") as Record<string, string>
  );
  const elevation = theme("elevation") as Record<string, number>;

  const components: CSSRuleObject[] = [];

  for (const [size, value] of themeValues) {
    components.push({
      "@media (platform: android)": {
        [key(size)]: {
          elevation: elevation[size] as any,
          shadowColor: getColor(value),
        },
      } as CSSRuleObject,
      "@media (platform: ios)": {
        [key(size)]: {
          boxShadow: value,
        },
      } as CSSRuleObject,
    });
  }

  addComponents(components);
});

function key(size: string) {
  return size === "DEFAULT" ? ".shadow" : `.shadow-${size}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getColor(_: string) {
  // TODO
  return "black";
}
