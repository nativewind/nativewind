import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { darkModeAtRule } from "./dark-mode";
import { color } from "./color";
import { verify } from "./verify";
import { webPropModifierPlugin } from "./prop-modifier";
import { webSwitch } from "./switch";
import { allowedColors } from "./common";

const preset: Config = {
  content: [],
  theme: {
    extend: {
      trackColor: allowedColors,
      thumbColor: allowedColors,
    },
  },
  plugins: [
    plugin(({ addVariant }) => addVariant("web", "&")),
    color,
    darkModeAtRule,
    verify,
    webPropModifierPlugin,
    webSwitch,
  ],
};

export default preset;
