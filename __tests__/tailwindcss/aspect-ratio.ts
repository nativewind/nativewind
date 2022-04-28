import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Aspect Ratio", [
  [
    "aspect-auto",
    {
      styles: {},
    },
  ],
  [
    "aspect-square",
    {
      styles: {
        "aspect-square": { aspectRatio: 1 },
      },
    },
  ],
  [
    "aspect-video",
    {
      styles: {
        "aspect-video": { aspectRatio: 1.777_777_778 },
      },
      media: {},
    },
  ],
  [
    "aspect-[4/3]",
    {
      styles: {
        "aspect-_4_3_": { aspectRatio: 1.333_333_333_333_333_3 },
      },
      media: {},
    },
  ],
]);
