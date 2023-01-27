const nativewind = require("nativewind/tailwind");
const {
  platformSelect,
  hairlineWidth,
} = require("nativewind/dist/runtime/native/theme-functions");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./App.tsx"],
  presets: [nativewind],
  theme: {
    extend: {
      borderWidth: {
        hairline: hairlineWidth(),
      },
      colors: {
        background: "var(--background-color)",
        foreground: "var(--foreground-color)",
      },
    },
    fontFamily: {
      mono: platformSelect({
        ios: "Menlo-Regular",
        android: "monospace",
      }),
    },
    variables: {
      "--background-color": "white",
      "--foreground-color": "black",
    },
    darkVariables: {
      "--background-color": "black",
      "--foreground-color": "white",
    },
  },
  plugins: [],
};
