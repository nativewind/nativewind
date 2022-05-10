import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Scale", [
  [
    "scale-0",
    {
      styles: {
        "scale-0": {
          transform: [{ scaleY: 0 }, { scaleX: 0 }],
        },
      },
    },
  ],
  [
    "scale-50",
    {
      styles: {
        "scale-50": {
          transform: [{ scaleY: 0.5 }, { scaleX: 0.5 }],
        },
      },
    },
  ],
  [
    "scale-x-50",
    {
      styles: {
        "scale-x-50": {
          transform: [{ scaleX: 0.5 }],
        },
      },
    },
  ],
  [
    "scale-y-50",
    {
      styles: {
        "scale-y-50": {
          transform: [{ scaleY: 0.5 }],
        },
      },
    },
  ],
]);
