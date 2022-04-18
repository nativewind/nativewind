import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Grow", [
  [
    "grow",
    {
      styles: {
        grow: {
          flexGrow: 1,
        },
      },
      media: {},
    },
  ],
  [
    "grow-0",
    {
      styles: {
        "grow-0": {
          flexGrow: 0,
        },
      },
      media: {},
    },
  ],
  [
    "grow-[1]",
    {
      styles: {
        "grow-_1_": {
          flexGrow: 1,
        },
      },
      media: {},
    },
  ],
]);
