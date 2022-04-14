import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Aspect Ratio", [
  [
    "aspect-auto",
    {
      styles: {
        "aspect-auto": { aspectRatio: undefined },
      },
      media: {},
    },
  ],
  [
    "aspect-square",
    {
      styles: {
        "aspect-square": { aspectRatio: 1 },
      },
      media: {},
    },
  ],
  [
    "aspect-video",
    {
      styles: {
        "aspect-video": { aspectRatio: 1.777777778 },
      },
      media: {},
    },
  ],
  [
    "aspect-[4/3]",
    {
      styles: {
        "aspect-_4_3_": { aspectRatio: 1.3333333333333333 },
      },
      media: {},
    },
  ],
]);
