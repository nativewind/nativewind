import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { darkModeAtRule } from "./dark-mode";

export default function nativewindPreset() {
  const preset: Config = {
    content: [],
    theme: {},
    plugins: [
      plugin(function ({ addVariant }) {
        addVariant("web", "&");
      }),
      darkModeAtRule,
    ],
  };
  return preset;
}
