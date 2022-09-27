import plugin from "tailwindcss/plugin";
import { CSSRuleObject } from "tailwindcss/types/config";

export const lineHeight = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      leading: (value: string) => {
        if (typeof value === "string" && value.endsWith("px")) {
          return { lineHeight: value };
        }

        return {} as CSSRuleObject;
      },
    },
    {
      values: { ...theme("lineHeight") },
      supportsNegativeValues: true,
    }
  );
});
