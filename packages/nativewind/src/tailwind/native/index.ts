import { Config } from "tailwindcss";

import { divide } from "./plugins/divide";
import { elevation } from "./plugins/elevation";
import { gap } from "./plugins/gap";
import { parent } from "./plugins/parent";
import { space } from "./plugins/space";
import nativewind from "./plugins/nativewind";
import variables from "./plugins/variables";
import { boxShadow } from "./plugins/box-shadow";
import { darkMode } from "./plugins/dark-mode";
import { scale } from "./plugins/scale";
import { skew } from "./plugins/skew";
import { rotate } from "./plugins/rotate";
import { translate } from "./plugins/translate";

const preset: Config = {
  nativewind: true,
  content: [],
  theme: {
    extend: {
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
  },
  plugins: [
    boxShadow,
    darkMode,
    divide,
    elevation,
    gap,
    nativewind,
    parent,
    space,
    variables,
    scale,
    skew,
    rotate,
    translate,
  ],
  corePlugins: {
    backgroundOpacity: false,
    borderOpacity: false,
    boxShadow: false,
    boxShadowColor: false,
    divideColor: false,
    divideOpacity: false,
    divideStyle: false,
    divideWidth: false,
    gap: false,
    placeholderOpacity: false,
    ringOpacity: false,
    space: false,
    textOpacity: false,
    scale: false,
    skew: false,
    rotate: false,
    translate: false,
  },
};

export default preset;
