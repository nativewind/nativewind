import plugin from "tailwindcss/plugin";
import {
  TailwindConfig,
  TailwindThemeValue,
} from "tailwindcss/tailwind-config";
import { StyleError } from "../../types/common";
import { divide } from "./divide";
import { elevation } from "./elevation";
import { fontSize } from "./font-size";
import { lineHeight } from "./line-height";
import { rotate } from "./rotate";
import { scale } from "./scale";
import { skew } from "./skew";
import { space } from "./space";
import { translate } from "./translate";

export interface NativePluginOptions {
  rem?: number;
  onError?: (error: StyleError) => void;
}

export const nativePlugin = plugin.withOptions<NativePluginOptions | undefined>(
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
      space(helpers, notSupported);
      divide(helpers, notSupported);
      fontSize(helpers);
      lineHeight(helpers, notSupported);
      elevation(helpers, notSupported);
      scale(helpers, notSupported);
      rotate(helpers, notSupported);
      translate(helpers, notSupported);
      skew(helpers, notSupported);
    };
  },
  function ({ rem = 16 } = {}) {
    const config: Partial<
      TailwindConfig & { theme: { elevation: TailwindThemeValue } }
    > = {
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
          lg: "7.5",
          xl: "12.5",
          "2xl": "25",
          none: "0",
        },
      },
      corePlugins: {
        space: false,
        fontSize: false,
        lineHeight: false,
        divideWidth: false,
        divideColor: false,
        divideStyle: false,
        divideOpacity: false,
        scale: false,
        transform: false,
        rotate: false,
        skew: false,
        translate: false,
      },
    };

    return config;
  }
);
