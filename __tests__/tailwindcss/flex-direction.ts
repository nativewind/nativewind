import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Direction", [
  [
    "flex-row",
    {
      styles: {
        "flex-row": {
          flexDirection: "row",
        },
      },
      media: {},
    },
  ],
  [
    "flex-row-reverse",
    {
      styles: {
        "flex-row-reverse": {
          flexDirection: "row-reverse",
        },
      },
      media: {},
    },
  ],
  [
    "flex-col",
    {
      styles: {
        "flex-col": {
          flexDirection: "column",
        },
      },
      media: {},
    },
  ],
  [
    "flex-col-reverse",
    {
      styles: {
        "flex-col-reverse": {
          flexDirection: "column-reverse",
        },
      },
      media: {},
    },
  ],
]);
