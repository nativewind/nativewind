import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Scale", [
  [
    "scale-0",
    {
      styles: {
        "scale-0": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  [
    "scale-50",
    {
      styles: {
        "scale-50": {
          transform: [
            { scaleY: 0.5 },
            { scaleX: 0.5 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  [
    "scale-x-50",
    {
      styles: {
        "scale-x-50": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0.5 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  [
    "scale-y-50",
    {
      styles: {
        "scale-y-50": {
          transform: [
            { scaleY: 0.5 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
]);
