import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Skew", [
  [
    "skew-x-0",
    {
      styles: {
        "skew-x-0": {
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
    "skew-y-0",
    {
      styles: {
        "skew-y-0": {
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
    "skew-x-1",
    {
      styles: {
        "skew-x-1": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "1deg" },
            { rotate: "0deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
  [
    "skew-y-1",
    {
      styles: {
        "skew-y-1": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "1deg" },
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
