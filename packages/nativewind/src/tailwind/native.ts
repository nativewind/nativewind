import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { PluginUtils } from "tailwindcss/types/config";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import withAlphaVariable from "tailwindcss/lib/util/withAlphaVariable";
import toColorValue from "tailwindcss/lib/util/toColorValue";

import { hairlineWidth, platformSelect } from "../theme";
import { darkModeAtRule } from "./dark-mode";
import { color } from "./color";
import { verify } from "./verify";
import { translateX, translateY } from "./translate";
import { shadows } from "./shadows";

const nativePlugins = plugin(function ({
  addUtilities,
  addVariant,
  corePlugins,
  config,
  matchUtilities,
  matchVariant,
  theme,
}) {
  const nativePlatforms = ["android", "ios", "windows", "macos"];
  /**
   * `display-mode` is a valid media query, but the ${platform} values are not.
   *
   * We need to either add a new Media Condition or hijack an existing one,
   * display-mode seems good enough?
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/@media/display-mode
   */
  for (const platform of nativePlatforms) {
    addVariant(platform, `@media (display-mode: ${platform})`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `@media (display-mode: ${platform})`),
  );

  /**
   * The native module requires the `.dark` selector to pickup darkMode variables
   * when using darkMode: 'class'
   *
   * If the user never uses the word 'dark' the selector will never be processed
   * This is an edge case, but one we often encounter in testing (where .dark)
   * will only contain CSS variables and never referenced directly
   */
  config("safelist").push("dark");

  /**
   * Change the visible/invisible classes
   *
   */
  addUtilities({
    ".visible": { opacity: 1 },
    ".invisible": { opacity: 0 },
  } as any);

  /**
   * prop-[]:
   */
  matchVariant(
    "prop",
    (value) => {
      return `&:native-prop(${value ?? ""})`;
    },
    {
      values: {
        DEFAULT: undefined,
      },
    },
  );

  /**
   * Native Prop remapping
   */
  addVariant("selection", "&:native-prop(selectionColor,color)");
  addVariant("placeholder", `&:native-prop(placeholderTextColor,color)`);
  matchUtilities(
    {
      caret: (value) => {
        return {
          "&:native-prop(cursorColor,caretColor)": {
            "caret-color": toColorValue(value),
          },
        };
      },
    },
    {
      values: flattenColorPalette(theme("caretColor")),
      type: ["color", "any"],
    },
  );
  matchUtilities(
    {
      placeholder: (value) => {
        if (!corePlugins("placeholderOpacity")) {
          return {
            "&:native-prop(placeholderTextColor,color)": {
              color: toColorValue(value),
            },
          };
        }
        return {
          "&:native-prop(placeholderTextColor,color)": withAlphaVariable({
            color: value,
            property: "color",
            variable: "--tw-placeholder-opacity",
          }),
        };
      },
    },
    {
      values: flattenColorPalette(theme("placeholderColor")),
      type: ["color", "any"],
    },
  );

  /**
   * SVG Prop remapping
   */
  matchUtilities(
    {
      fill: (value) => ({
        "&:native-prop(fill)": {
          fill: toColorValue(value),
        },
      }),
    },
    { values: flattenColorPalette(theme("fill")), type: ["color", "any"] },
  );

  matchUtilities(
    {
      stroke: (value) => ({
        "&:native-prop(stroke)": {
          stroke: toColorValue(value),
        },
      }),
    },
    { values: flattenColorPalette(theme("stroke")), type: ["color", "any"] },
  );

  matchUtilities(
    {
      stroke: (value) => ({
        "&:native-prop(strokeWidth)": {
          strokeWidth: toColorValue(value),
        },
      }),
    },
    { values: theme("strokeWidth"), type: ["length", "number", "percentage"] },
  );
});

const preset: Config = {
  content: [],
  theme: {
    extend: {
      fontFamily: {
        sans: platformSelect({ android: "san-serif", ios: "'system font'" }),
        serif: platformSelect({ android: "serif", ios: "Georgia" }),
        mono: platformSelect({ android: "mono", ios: "'Courier New'" }),
      },
      boxShadow: {
        sm: "0 1px 1px rgb(0 0 0 / 0.05)",
        DEFAULT: "0 1px 2px rgb(0 0 0 / 0.1)",
        md: "0 4px 3px rgb(0 0 0 / 0.1)",
        lg: "0 10px 8px rgb(0 0 0 / 0.1)",
        xl: "0 20px 13px rgb(0 0 0 / 0.1)",
        "2xl": "0 25px 25px rgb(0 0 0 / 0.15)",
        none: "0 0 #0000",
      },
      translateX: ({ theme }: PluginUtils) => ({
        ...theme("spacing"),
        "1/2": "50rnw",
        "1/3": "33.333333rnw",
        "2/3": "66.666667rnw",
        "1/4": "25rnw",
        "2/4": "50rnw",
        "3/4": "75rnw",
        full: "100rnw",
      }),
      translateY: ({ theme }: PluginUtils) => ({
        ...theme("spacing"),
        "1/2": "50rnh",
        "1/3": "33.333333rnh",
        "2/3": "66.666667rnh",
        "1/4": "25rnh",
        "2/4": "50rnh",
        "3/4": "75rnh",
        full: "100rnh",
      }),
      borderWidth: {
        hairline: hairlineWidth(),
      },
      letterSpacing: {
        tighter: "-0.5px",
        tight: "-0.25px",
        normal: "0px",
        wide: "0.25px",
        wider: "0.5px",
        widest: "1px",
      },
      elevation: {
        sm: "1.5",
        DEFAULT: "3",
        md: "6",
        lg: "7.5",
        xl: "12.5",
        "2xl": "25",
        none: "0",
      },
      transitionProperty: {
        DEFAULT:
          "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY, filter, backdrop-filter",
        all: "background-color, border-bottom-color, border-bottom-left-radius, border-bottom-right-radius, border-bottom-width, border-color, border-left-color, border-left-width, border-radius, border-right-color, border-right-width, border-top-color, border-top-width, border-width, color, fill, font-size, font-weight, gap, letter-spacing, line-height, margin, margin-bottom, margin-left, margin-right, margin-top, object-position, opacity, order, padding, padding-bottom, padding-left, padding-right, padding-top, rotate, scale, stroke, text-decoration, text-decoration-color, transform, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY, transform-origin, translate, vertical-align, visibility, word-spacing, z-index",
        transform:
          "transform, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY",
      },
    },
  },
  plugins: [
    color,
    darkModeAtRule,
    shadows,
    translateX,
    translateY,
    verify,
    nativePlugins,
  ],
  corePlugins: {
    preflight: false,
    backgroundOpacity: false,
    borderOpacity: false,
    boxShadow: false,
    caretColor: false,
    divideOpacity: false,
    fill: false,
    placeholderColor: false,
    placeholderOpacity: false,
    ringOpacity: false,
    stroke: false,
    strokeWidth: false,
    textOpacity: false,
    translate: false,
    visibility: false,
  },
};

export default preset;
