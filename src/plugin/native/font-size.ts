import { TailwindPluginFn } from "tailwindcss/plugin";
import isPlainObject from "./utils";

/**
 * This "fixes" the fontSize plugin to calculate relative lineHeight's
 * based upon the fontsize. lineHeight's with units are kept as is
 *
 * Eg
 * { lineHeight: 1, fontSize: 12 } -> { lineHeight: 12, fontSize 12}
 * { lineHeight: 1px, fontSize: 12 } -> { lineHeight: 1px, fontSize 12}
 */
export const fontSize: TailwindPluginFn = ({ matchUtilities, theme }) => {
  matchUtilities(
    {
      text: (value: unknown) => {
        const [fontSize, options] = Array.isArray(value) ? value : [value];
        const { lineHeight, letterSpacing } = isPlainObject(options)
          ? options
          : { lineHeight: options, letterSpacing: undefined };

        return {
          "font-size": fontSize,
          ...(lineHeight === undefined
            ? {}
            : {
                "line-height": lineHeight.endsWith("px")
                  ? lineHeight
                  : `${Number.parseFloat(fontSize) * lineHeight}px`,
              }),
          ...(letterSpacing === undefined
            ? {}
            : { "letter-spacing": letterSpacing }),
        };
      },
    },
    {
      values: theme("fontSize"),
      type: ["absolute-size", "relative-size", "length", "percentage"],
    }
  );
};
