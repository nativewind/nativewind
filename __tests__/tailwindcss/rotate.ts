import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Scale", [
  [
    "rotate-0",
    {
      styles: {
        "rotate-0": {
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
    "rotate-45",
    {
      styles: {
        "rotate-45": {
          transform: [
            { scaleY: 0 },
            { scaleX: 0 },
            { skewY: "0deg" },
            { skewX: "0deg" },
            { rotate: "45deg" },
            { translateY: 0 },
            { translateX: 0 },
          ],
        },
      },
    },
  ],
]);
