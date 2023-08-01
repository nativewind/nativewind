import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { darkModeAtRule } from "./dark-mode";
import { ContentConfig } from "tailwindcss/types/config";

export default function nativewindPreset() {
  const preset: Config = {
    content: [],
    theme: {
      extend: {
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
    plugins: [forceDark, platforms, darkModeAtRule],
  };

  return preset;
}

/**
 * The native module requires the `.dark` selector to pickup darkMode variables
 * when using darkMode: 'class'
 *
 * If the user never uses the word 'dark' the selector will never be processed
 * This is an edge, but one we often encounter in testing (where .dark)
 * will only contain CSS variables and never referenced directly
 */
const forceDark = plugin(function ({ config }) {
  const content = config<Extract<ContentConfig, { files: any }>>("content");
  content.files.push({ raw: "dark" });
});

const platforms = plugin(function ({ addVariant }) {
  const nativePlatforms = ["android", "ios", "windows", "macos"];

  for (const platform of nativePlatforms) {
    addVariant(platform, `@media ${platform}`);
  }

  addVariant(
    "native",
    nativePlatforms.map((platform) => `@media ${platform}`),
  );

  addVariant(
    "web",
    nativePlatforms.map((platform) => `@media web`),
  );
});
