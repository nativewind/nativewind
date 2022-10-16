import { Config } from "tailwindcss";

import { divide } from "./plugins/divide";
import { elevation } from "./plugins/elevation";
import { gap } from "./plugins/gap";
import { group } from "./plugins/group";
import { scopedGroup } from "./plugins/scoped-group";
import { parent } from "./plugins/parent";
import { space } from "./plugins/space";
import nativewind from "./plugins/nativewind";
import variables from "./plugins/variables";
import { boxShadow } from "./plugins/box-shadow";
import { darkMode } from "./plugins/dark-mode";

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
    group,
    nativewind,
    parent,
    scopedGroup,
    space,
    variables,
  ],
  corePlugins: {
    // We do not support scoped variables
    divideOpacity: false,
    borderOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    backgroundOpacity: false,
    textOpacity: false,
    boxShadowColor: false,
    boxShadow: false,
    // These libraries are replaced with custom logic
    gap: false,
    space: false,
    divideWidth: false,
    divideColor: false,
    divideStyle: false,
  },
};

export default preset;
