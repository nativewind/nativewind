import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import createUtilityPlugin from "tailwindcss/lib/util/createUtilityPlugin";

import { darkModeAtRule } from "./dark-mode";
import { ContentConfig, PluginUtils } from "tailwindcss/types/config";
import { hairlineWidth } from "./functions";

export default function nativewindPreset() {
  const preset: Config = {
    content: [],
    theme: {
      extend: {
        translateX: ({ theme }: PluginUtils) => ({
          ...theme("spacing"),
          "1/2": "50cw",
          "1/3": "33.333333cw",
          "2/3": "66.666667cw",
          "1/4": "25cw",
          "2/4": "50cw",
          "3/4": "75cw",
          full: "100cw",
        }),
        translateY: ({ theme }: PluginUtils) => ({
          ...theme("spacing"),
          "1/2": "50ch",
          "1/3": "33.333333ch",
          "2/3": "66.666667ch",
          "1/4": "25ch",
          "2/4": "50ch",
          "3/4": "75ch",
          full: "100ch",
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
      },
    },
    plugins: [forceDark, platforms, darkModeAtRule, translateX, translateY],
    corePlugins: {
      translate: false,
    },
  };

  return preset;
}

/**
 * The native module requires the `.dark` selector to pickup darkMode variables
 * when using darkMode: 'class'
 *
 * If the user never uses the word 'dark' the selector will never be processed
 * This is an edge, but one we often encounter in testing (where .dark)
 * will only contain CSS variables and never referenced directly
 */
const forceDark = plugin(function ({ config }) {
  const content = config<Extract<ContentConfig, { files: any }>>("content");
  content.files.push({ raw: "dark" });
});

const platforms = plugin(function ({ addVariant }) {
  const nativePlatforms = ["android", "ios", "windows", "macos"];

  for (const platform of nativePlatforms) {
    addVariant(platform, `@media (display-mode: ${platform})`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `@media (display-mode: ${platform})`),
  );

  addVariant(
    "web",
    nativePlatforms.map((platform) => `@media (display-mode: browser)`),
  );
});

/**
 * React Native doesn't support % values for translate styles.
 * We need to change Tailwindcss to use the `react-native-css-interop` ch and cw units
 */
let cssTransformValue = [
  "translate(var(--tw-translate-x), var(--tw-translate-y))",
  "rotate(var(--tw-rotate))",
  "skewX(var(--tw-skew-x))",
  "skewY(var(--tw-skew-y))",
  "scaleX(var(--tw-scale-x))",
  "scaleY(var(--tw-scale-y))",
].join(" ");

const translateX = createUtilityPlugin(
  "translateX",
  [
    [
      [
        "translate-x",
        [
          ["@defaults transform", {}],
          "--tw-translate-x",
          ["transform", cssTransformValue],
        ],
      ],
    ],
  ],
  { supportsNegativeValues: true },
);

const translateY = createUtilityPlugin(
  "translateY",
  [
    [
      [
        "translate-y",
        [
          ["@defaults transform", {}],
          "--tw-translate-y",
          ["transform", cssTransformValue],
        ],
      ],
    ],
  ],
  { supportsNegativeValues: true },
);
