import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Shrink", [
  [
    "shrink",
    {
      styles: {
        shrink: {
          flexShrink: 1,
        },
      },
      media: {},
    },
  ],
  [
    "shrink-0",
    {
      styles: {
        "shrink-0": {
          flexShrink: 0,
        },
      },
      media: {},
    },
  ],
]);
