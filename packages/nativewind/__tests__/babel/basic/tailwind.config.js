const nativewind = require("../../../dist/tailwind/native-preset");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./__tests__/babel/basic/code.{js,ts,jsx,tsx}"],
  presets: [nativewind.default],
  theme: {
    extend: {},
  },
};
