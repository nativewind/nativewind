import plugin from "tailwindcss/plugin";
import { StyleError } from "../../types/common";
import { boxShadow } from "./box-shadow";
import { groupIsolate } from "./group-isolate";
import { divide } from "./divide";
import { elevation } from "./elevation";
import { fontSize } from "./font-size";
import { gap } from "./gap";
import { lineHeight } from "./line-height";
import { rotate } from "./rotate";
import { scale } from "./scale";
import { skew } from "./skew";
import { space } from "./space";
import { translate } from "./translate";
import { parent } from "./parent";
import { color } from "./color";
import { Config } from "tailwindcss";
import { dark } from "./dark";
import { DarkModeConfig } from "tailwindcss/types/config";
import { pseudoClasses } from "./pseudo-classes";
import { platforms, nativePlatforms } from "../../utils/platforms";
import { boxShadowColor } from "./box-shadow-color";
import { hairlineWidth } from "../../theme-functions";

// This is used by platformSelect to detect if we are in an
// environment that can use Platform.select (ie not using CSS)
// If we are in React Native, then this plugin should be loaded
process.env.NATIVEWIND_NATIVE_PLUGIN_ENABLED = "1";

export interface NativePluginOptions {
  rem?: number;
  onError?: (error: StyleError) => void;
}

export const nativePlugin = plugin.withOptions<NativePluginOptions>(
  function ({
    onError = () => {
      return;
    },
  } = {}) {
    function notSupported(property: string) {
      return () => {
        onError({ error: `${property} is not available on native` });
        return {};
      };
    }

    return (helpers) => {
      // This helper is used by babel to stop warnings from being printed
      // on files without styles when using Hot Module Reload.
      // Because it doesn't have any styles, it will be omitted from the output
      helpers.addUtilities({ ".babel-empty": {} });

      for (const platform of platforms) {
        helpers.addVariant(platform, `&::${platform}`);
      }

      helpers.addVariant(
        "native",
        nativePlatforms.map((platform) => `&::${platform}`)
      );

      color(helpers, notSupported);
      dark(helpers, notSupported);
      space(helpers, notSupported);
      divide(helpers, notSupported);
      gap(helpers, notSupported);
      fontSize(helpers);
      lineHeight(helpers, notSupported);
      pseudoClasses(helpers, notSupported);
      elevation(helpers, notSupported);
      scale(helpers, notSupported);
      rotate(helpers, notSupported);
      translate(helpers, notSupported);
      skew(helpers, notSupported);
      boxShadow(helpers, notSupported);
      boxShadowColor(helpers, notSupported);
      groupIsolate(helpers, notSupported);
      parent(helpers, notSupported);
    };
  },
  function ({ rem = 16 } = {}) {
    const config: Partial<
      Config & { theme: { elevation: Record<string, string> } }
    > = {
      // We need to do this to force dark mode off
      darkMode: "off" as DarkModeConfig,
      theme: {
        aspectRatio: {
          auto: "0",
          square: "1",
          video: "1.777777778",
        },
        letterSpacing: {
          tighter: "-0.5px",
          tight: "-0.25px",
          normal: "0px",
          wide: "0.25px",
          wider: "0.5px",
          widest: "1px",
        },
        borderWidth: {
          DEFAULT: "1px",
          0: "0px",
          0.5: hairlineWidth(),
          2: "2px",
          4: "4px",
          8: "8px",
        },
        strokeWidth: {
          0: "0px",
          1: "1px",
          2: "2px",
        },
        spacing: {
          px: "1px",
          0: "0px",
          0.5: `${rem * 0.125}px`,
          1: `${rem * 0.25}px`,
          1.5: `${rem * 0.375}px`,
          2: `${rem * 0.5}px`,
          2.5: `${rem * 0.625}px`,
          3: `${rem * 0.75}px`,
          3.5: `${rem * 0.875}px`,
          4: `${rem * 1}px`,
          5: `${rem * 1.25}px`,
          6: `${rem * 1.5}px`,
          7: `${rem * 1.75}px`,
          8: `${rem * 2}px`,
          9: `${rem * 2.25}px`,
          10: `${rem * 2.5}px`,
          11: `${rem * 2.75}px`,
          12: `${rem * 3}px`,
          14: `${rem * 3.5}px`,
          16: `${rem * 4}px`,
          20: `${rem * 5}px`,
          24: `${rem * 6}px`,
          28: `${rem * 7}px`,
          32: `${rem * 8}px`,
          36: `${rem * 9}px`,
          40: `${rem * 10}px`,
          44: `${rem * 11}px`,
          48: `${rem * 12}px`,
          52: `${rem * 13}px`,
          56: `${rem * 14}px`,
          60: `${rem * 15}px`,
          64: `${rem * 16}px`,
          72: `${rem * 18}px`,
          80: `${rem * 20}px`,
          96: `${rem * 24}px`,
        },
        borderRadius: {
          none: "0px",
          sm: `${rem * 0.125}px`,
          DEFAULT: `${rem * 0.25}px`,
          md: `${rem * 0.375}px`,
          lg: `${rem * 0.5}px`,
          xl: `${rem * 0.75}px`,
          "2xl": `${rem * 1}px`,
          "3xl": `${rem * 1.5}px`,
          full: "9999px",
        },
        fontSize: {
          xs: [`${rem * 0.75}px`, { lineHeight: `${rem * 1}px` }],
          sm: [`${rem * 0.875}px`, { lineHeight: `${rem * 1.25}px` }],
          base: [`${rem * 1}px`, { lineHeight: `${rem * 1.5}px` }],
          lg: [`${rem * 1.125}px`, { lineHeight: `${rem * 1.75}px` }],
          xl: [`${rem * 1.25}px`, { lineHeight: `${rem * 1.75}px` }],
          "2xl": [`${rem * 1.5}px`, { lineHeight: `${rem * 2}px` }],
          "3xl": [`${rem * 1.875}px`, { lineHeight: `${rem * 2.25}px` }],
          "4xl": [`${rem * 2.25}px`, { lineHeight: `${rem * 2.5}px` }],
          "5xl": [`${rem * 3}px`, { lineHeight: "1" }],
          "6xl": [`${rem * 3.75}px`, { lineHeight: "1" }],
          "7xl": [`${rem * 4.5}px`, { lineHeight: "1" }],
          "8xl": [`${rem * 6}px`, { lineHeight: "1" }],
          "9xl": [`${rem * 8}px`, { lineHeight: "1" }],
        },
        lineHeight: {
          none: "1",
          tight: "1.25",
          snug: "1.375",
          normal: "1.5",
          relaxed: "1.625",
          loose: "2",
          3: `${rem * 0.75}px`,
          4: `${rem * 1}px`,
          5: `${rem * 1.25}px`,
          6: `${rem * 1.5}px`,
          7: `${rem * 1.75}px`,
          8: `${rem * 2}px`,
          9: `${rem * 2.25}px`,
          10: `${rem * 2.5}px`,
        },
        maxWidth: ({ theme, breakpoints }) => ({
          none: "none",
          0: `${rem * 0}px`,
          xs: `${rem * 20}px`,
          sm: `${rem * 24}px`,
          md: `${rem * 28}px`,
          lg: `${rem * 32}px`,
          xl: `${rem * 36}px`,
          "2xl": `${rem * 42}px`,
          "3xl": `${rem * 48}px`,
          "4xl": `${rem * 56}px`,
          "5xl": `${rem * 64}px`,
          "6xl": `${rem * 72}px`,
          "7xl": `${rem * 80}px`,
          full: "100%",
          min: "min-content",
          max: "max-content",
          fit: "fit-content",
          prose: "65ch",
          ...breakpoints(theme("screens")),
        }),
        elevation: {
          sm: "1.5",
          DEFAULT: "3",
          md: "6",
          lg: "7.5",
          xl: "12.5",
          "2xl": "25",
          none: "0",
        },
        boxShadow: {
          sm: "0px 1px 2px rgba(0, 0, 0, 0.1)",
          DEFAULT: "0px 2px 6px rgba(0, 0, 0, 0.1)",
          md: "0px 6px 10px rgba(0, 0, 0, 0.1)",
          lg: "0px 10px 15px rgba(0, 0, 0, 0.1)",
          xl: "0px 20px 25px rgba(0, 0, 0, 0.1)",
          "2xl": "0px 25px 50px rgba(0, 0, 0, 0.1)",
          none: "0px 0px 0px rgba(0, 0, 0, 0)",
        },
      },
      corePlugins: {
        // These are v2 plugins that don't work well with this library
        // we only support v3, so its safe to disable them
        divideOpacity: false,
        borderOpacity: false,
        placeholderOpacity: false,
        ringOpacity: false,
        backgroundOpacity: false,
        textOpacity: false,

        // These libraries are replaced with custom logic
        boxShadow: false,
        boxShadowColor: false,
        divideColor: false,
        divideStyle: false,
        divideWidth: false,
        lineHeight: false,
        fontSize: false,
        gap: false,
        rotate: false,
        scale: false,
        skew: false,
        space: false,
        transform: false,
        translate: false,
      },
    };

    return config as Config;
  }
);
