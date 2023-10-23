/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        neutral: {
          950: "rgb(var(--color-neutral-950) / <alpha-value>)",
        },
      },
    },
  },
  plugins: [],
};
