const nativewind = require("nativewind/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx"],
  presets: [nativewind],
  theme: {
    extend: {},
  },
  plugins: [],
};
