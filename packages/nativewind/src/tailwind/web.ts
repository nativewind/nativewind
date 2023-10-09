import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { darkModeAtRule } from "./dark-mode";
import { color } from "./color";
import { verify } from "./verify";

const preset: Config = {
  content: [],
  theme: {},
  plugins: [
    plugin(({ addVariant }) => addVariant("web", "&")),
    color,
    darkModeAtRule,
    verify,
  ],
};

export default preset;
