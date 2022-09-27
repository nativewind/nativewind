/* eslint-disable @typescript-eslint/no-explicit-any */
import plugin from "tailwindcss/plugin";
// import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette";
// import toColorValue from "tailwindcss/lib/util/toColorValue";

export const divide = plugin(function ({ matchUtilities, theme }) {
  matchUtilities(
    {
      "divide-x": (value) => {
        value = value === "0" ? "0px" : value;
        return {
          "&:merge(:parent)": {},
          ":merge(.children)&:not-first-child": {
            "border-left-width": value,
            "border-right-width": 0,
          },
        } as any;
      },
      "divide-y": (value: string) => {
        value = value === "0" ? "0px" : value;

        return {
          "&:merge(:children):not-first-child": {
            "border-bottom-width": 0,
            "border-top-width": value,
          },
        } as any;
      },
    },
    { values: theme("divideWidth"), type: ["line-width", "length"] }
  );
});

// matchUtilities(
//   {
//     divide: (value: string) => {
//       return {
//         "&": {
//           "@selector (> *:not(:first-child))": {
//             "border-color": toColorValue(value),
//           },
//         },
//       };
//     },
//   },
//   {
//     values: (({ DEFAULT: _, ...colors }) => colors)(
//       flattenColorPalette(theme("divideColor"))
//     ),
//     type: "color",
//   }
// );

// addUtilities({
//   ".divide-solid": {
//     "@selector (> *:not(:first-child))": {
//       "border-style": "solid",
//     },
//   },
//   ".divide-dashed": {
//     "@selector (> *:not(:first-child))": {
//       "border-style": "dashed",
//     },
//   },
//   ".divide-dotted": {
//     "@selector (> *:not(:first-child))": {
//       "border-style": "dotted",
//     },
//   },
//   ".divide-double": {
//     "@selector (> *:not(:first-child))": {
//       "border-style": "double",
//     },
//   },
//   ".divide-none": {
//     "@selector (> *:not(:first-child))": {
//       "border-style": "none",
//     },
//   },
// })
