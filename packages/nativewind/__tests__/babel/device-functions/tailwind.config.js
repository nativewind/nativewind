module.exports = {
  content: [`${__dirname}/code.{js,ts,jsx,tsx}`],
  theme: {
    extend: {
      fontSize: {
        hairline: "hairlineWidth()",
        custom: "roundToNearestPixel(hairlineWidth())",
      },
    },
  },
};
