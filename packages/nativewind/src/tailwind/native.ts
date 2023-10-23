import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { PluginUtils } from "tailwindcss/types/config";

import { hairlineWidth, platformSelect } from "../theme";
import { darkModeAtRule } from "./dark-mode";
import { color } from "./color";
import { verify } from "./verify";
import { translateX, translateY } from "./translate";
import { shadows } from "./shadows";

/**
 * The native module requires the `.dark` selector to pickup darkMode variables
 * when using darkMode: 'class'
 *
 * If the user never uses the word 'dark' the selector will never be processed
 * This is an edge case, but one we often encounter in testing (where .dark)
 * will only contain CSS variables and never referenced directly
 */
const forceDark = plugin(function ({ config }) {
  config("safelist").push("dark");
});

const visibility = plugin(({ addUtilities }) => {
  addUtilities({
    ".visible": { opacity: 1 },
    ".invisible": { opacity: 0 },
  } as any);
});

const platforms = plugin(function ({ addVariant }) {
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
    forceDark,
    platforms,
    translateX,
    translateY,
    visibility,
    verify,
  ],
  corePlugins: {
    preflight: false,
    translate: false,
    boxShadow: false,
    visibility: false,
    textOpacity: false,
    divideOpacity: false,
    borderOpacity: false,
    backgroundOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
  },
};

export default preset;
