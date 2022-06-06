module.exports = {
  content: [`./custom-theme/*.{js,ts,jsx,tsx}`],
  theme: {
    extend: {
      padding: {
        px: "roundToNearestPixel(4)",
      },
      colors: {
        blue: {
          500: {
            ios: "platformColor(systemTealColor)",
            android: "platformColor(@android:color/holo_blue_bright)",
            default: "black",
          },
        },
      },
    },
  },
};
