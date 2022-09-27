import { Config } from "tailwindcss";
import theme from "./native-theme";

import { boxShadow } from "./plugins/box-shadow";
import { boxShadowColor } from "./plugins/box-shadow-color";
import { divide } from "./plugins/divide";
import { elevation } from "./plugins/elevation";
import { fontSize } from "./plugins/font-size";
import { gap } from "./plugins/gap";
import { group } from "./plugins/group";
import { groupIsolate } from "./plugins/group-isolate";
import { lineHeight } from "./plugins/line-height";
import { parent } from "./plugins/parent";
import { rotate } from "./plugins/rotate";
import { scale } from "./plugins/scale";
import { skew } from "./plugins/skew";
import { space } from "./plugins/space";
import { translate } from "./plugins/translate";

const preset: Config = {
  nativewind: true,
  content: [],
  theme,
  plugins: [
    boxShadow,
    boxShadowColor,
    divide,
    elevation,
    fontSize,
    gap,
    group,
    groupIsolate,
    lineHeight,
    parent,
    rotate,
    scale,
    skew,
    space,
    translate,
  ],
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
    fontSize: false,
    gap: false,
    lineHeight: false,
    rotate: false,
    scale: false,
    skew: false,
    space: false,
    transform: false,
    translate: false,
  },
};

export default preset;
