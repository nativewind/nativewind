import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { darkModeAtRule } from "./dark-mode";
import { ContentConfig, PluginUtils } from "tailwindcss/types/config";
import { hairlineWidth, platformSelect } from "../theme";
import { color } from "./color";
import { verify } from "./verify";
import { translateX, translateY } from "./translate";
import { shadows } from "./shadows";

export default function nativewindPreset() {
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

  return preset;
}

/**
 * The native module requires the `.dark` selector to pickup darkMode variables
 * when using darkMode: 'class'
 *
 * If the user never uses the word 'dark' the selector will never be processed
 * This is an edge case, but one we often encounter in testing (where .dark)
 * will only contain CSS variables and never referenced directly
 */
const forceDark = plugin(function ({ config }) {
  const content = config<Extract<ContentConfig, { files: any }>>("content");
  content.files.push({ raw: "dark" });
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
