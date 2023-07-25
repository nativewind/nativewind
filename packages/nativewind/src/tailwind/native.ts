import { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

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
    plugins: [platforms],
  };

  return preset;
}

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
