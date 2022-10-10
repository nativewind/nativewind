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

const preset: Config & { safelist: string[] } = {
  nativewind: true,
  content: [],
  safelist: [".dark"],
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
    },
  },
  plugins: [
    divide,
    elevation,
    gap,
    group,
    nativewind,
    variables,
    parent,
    scopedGroup,
    space,
  ],
  corePlugins: {
    // We do not support scoped variables
    divideOpacity: false,
    borderOpacity: false,
    placeholderOpacity: false,
    ringOpacity: false,
    backgroundOpacity: false,
    textOpacity: false,
    // These libraries are replaced with custom logic
    gap: false,
    space: false,
    divideWidth: false,
  },
};

export default preset;
