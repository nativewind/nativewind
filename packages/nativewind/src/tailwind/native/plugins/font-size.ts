import isPlainObject from "tailwindcss/lib/util/isPlainObject";
import plugin from "tailwindcss/plugin";
import { CSSRuleObject } from "tailwindcss/types/config";

/**
 * This "fixes" the fontSize plugin to calculate relative lineHeight's
 * based upon the fontsize. lineHeight's with units are kept as is
 *
 * Eg
 * { lineHeight: 1, fontSize: 12 } -> { lineHeight: 12, fontSize 12}
 * { lineHeight: 1px, fontSize: 12 } -> { lineHeight: 1px, fontSize 12}
 */
export const fontSize = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      text: (value: unknown) => {
        const [fontSize, options] = Array.isArray(value) ? value : [value];
        const { lineHeight, letterSpacing } = isPlainObject(options)
          ? options
          : { lineHeight: options, letterSpacing: undefined };

        const fontSizeRecord: CSSRuleObject = {
          "font-size": fontSize,
        };

        if (lineHeight) {
          if (lineHeight.endsWith("rem") || lineHeight.endsWith("px")) {
            fontSizeRecord["line-height"] = lineHeight;
          } else if (fontSize.endsWith("px")) {
            fontSizeRecord["line-height"] = `${
              Number.parseFloat(fontSize) * lineHeight
            }px`;
          } else if (fontSize.endsWith("rem")) {
            fontSizeRecord["line-height"] = `${
              Number.parseFloat(fontSize) * lineHeight
            }rem`;
          }
        }

        if (letterSpacing) {
          fontSizeRecord["letter-spacing"] = letterSpacing;
        }

        return fontSizeRecord;
      },
    },
    {
      values: theme("fontSize"),
      type: ["absolute-size", "relative-size", "length", "percentage"],
    }
  );
});
