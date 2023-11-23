import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { PluginUtils } from "tailwindcss/types/config";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
import toColorValue from "tailwindcss/lib/util/toColorValue";

import { hairlineWidth, platformSelect } from "../theme";
import { darkModeAtRule } from "./dark-mode";
import { color } from "./color";
import { verify } from "./verify";
import { translateX, translateY } from "./translate";
import { shadows } from "./shadows";
import { allowedColors } from "./common";
import { nativeSwitch } from "./switch";

const nativePlugins = plugin(function ({
  addBase,
  addUtilities,
  addVariant,
  config,
  matchUtilities,
  matchVariant,
  theme,
  ...other
}) {
  const nativePlatforms = ["android", "ios", "windows", "macos"];

  // RN requires the unit, so reset the defaults
  // This is an undocumented feature of Tailwind that allows you to modify the @default layer
  (other as any).addDefaults("transform", {
    "--tw-rotate": "0deg",
    "--tw-skew-x": "0deg",
    "--tw-skew-y": "0deg",
  });

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
    (value = "*", { modifier }) => {
      return `&:native-prop(${[value, modifier].filter(Boolean).join(",")})`;
    },
    { values: { DEFAULT: undefined } },
  );

  /**
   * Native Prop remapping
   */
  addVariant("selection", (({ container }: any) => {
    container.walkRules((rule: any) => {
      rule.walkDecls((decl: any) => {
        if (decl.prop == "color") {
          decl.prop = "-rn-selectionColor";
        }
      });
    });
    return "&:native-prop()";
  }) as any);

  addVariant("placeholder", (({ container }: any) => {
    container.walkRules((rule: any) => {
      rule.walkDecls((decl: any) => {
        if (decl.prop == "color") {
          decl.prop = "-rn-placeholderTextColor";
        }
      });
    });
    return "&:native-prop()";
  }) as any);

  // https:github.com/tailwindlabs/tailwindcss/blob/eb2fe9494b638c3b67194f3ddf3c040f064e060d/src/corePlugins.js#L729C3-L750C5
  matchUtilities(
    {
      "line-clamp": (value) => ({
        "&:native-prop(numberOfLines,numberOfLines)": {
          overflow: "hidden",
          "-rn-numberOfLines": value,
        },
      }),
    },
    { values: theme("lineClamp") },
  );

  addUtilities({
    ".line-clamp-none": {
      "&:native-prop(numberOfLines,numberOfLines)": {
        overflow: "visible",
        "-rn-numberOfLines": "0",
      },
    },
  });

  /**
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  matchUtilities(
    {
      ripple: (value) => {
        return {
          "&:move-prop(color,android_ripple)": {
            color: toColorValue(value),
          },
        };
      },
    },
    {
      values: flattenColorPalette(theme("rippleColor")),
      type: ["color", "any"],
    },
  );
  matchUtilities(
    {
      ripple: (value) => {
        return {
          "&:move-prop(borderless,android_ripple)": {
            "-rn-borderless": value,
          },
        };
      },
    },
    {
      values: {
        borderless: "true",
        bordered: "false",
      },
      type: "any",
    },
  );

  matchUtilities(
    {
      caret: (value) => {
        return {
          "&:native-prop()": {
            "-rn-cursorColor": toColorValue(value),
          },
        };
      },
    },
    {
      values: flattenColorPalette(theme("caretColor")),
      type: ["color", "any"],
    },
  );

  /**
   * SVG Prop remapping
   */
  matchUtilities(
    {
      fill: (value) => ({
        "&:native-prop()": {
          fill: toColorValue(value),
        },
      }),
    },
    { values: flattenColorPalette(theme("fill")), type: ["color", "any"] },
  );

  matchUtilities(
    {
      stroke: (value) => ({
        "&:native-prop()": {
          stroke: toColorValue(value),
        },
      }),
    },
    { values: flattenColorPalette(theme("stroke")), type: ["color", "any"] },
  );

  matchUtilities(
    {
      stroke: (value) => ({
        "&:native-prop()": {
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
      elevation: {
        sm: "1",
        DEFAULT: "3",
        md: "6",
        lg: "8",
        xl: "13",
        "2xl": "24",
        none: "0",
      },
      boxShadow: {
        sm: " 0px 1px 1px rgba(0, 0, 0, 0.35)",
        DEFAULT: "0px 1px 4px rgba(0, 0, 0, 0.35)",
        md: "0px 3px 10px rgba(0, 0, 0, 0.35)",
        lg: "0px 4px 10px rgba(0, 0, 0, 0.35)",
        xl: "0px 6px 19px rgba(0, 0, 0, 0.35)",
        "2xl": "0px 12px 38px rgba(0, 0, 0, 0.35) ",
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
      transitionProperty: {
        DEFAULT:
          "color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY, filter, backdrop-filter",
        all: "background-color, border-bottom-color, border-bottom-left-radius, border-bottom-right-radius, border-bottom-width, border-color, border-left-color, border-left-width, border-radius, border-right-color, border-right-width, border-top-color, border-top-width, border-width, color, fill, font-size, font-weight, gap, letter-spacing, line-height, margin, margin-bottom, margin-left, margin-right, margin-top, object-position, opacity, order, padding, padding-bottom, padding-left, padding-right, padding-top, rotate, scale, stroke, text-decoration, text-decoration-color, transform, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY, transform-origin, translate, vertical-align, visibility, word-spacing, z-index",
        transform:
          "transform, perspective, rotate, rotateX, rotateY, rotateZ, scale, scaleX, scaleY, translateX, translateY, skewX, skewY",
      },
      trackColor: allowedColors,
      thumbColor: allowedColors,
      rippleColor: allowedColors,
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
    nativeSwitch,
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
    lineClamp: false,
    ringOpacity: false,
    stroke: false,
    strokeWidth: false,
    textOpacity: false,
    translate: false,
    visibility: false,
  },
};

export default preset;
