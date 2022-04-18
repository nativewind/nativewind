import { tailwindRunner } from "./runner";
// flex-1	flex: 1 1 0%;
// flex-auto	flex: 1 1 auto;
// flex-initial	flex: 0 1 auto;
// flex-none	flex: none;

tailwindRunner("Layout - Flex", [
  [
    "flex",
    {
      styles: {
        flex: {
          display: "flex",
        },
      },
      media: {},
    },
  ],
  [
    "flex-auto",
    {
      styles: {
        "flex-auto": {
          flexGrow: 1,
          flexShrink: 1,
        },
      },
      media: {},
    },
  ],
  [
    "flex-initial",
    {
      styles: {
        "flex-initial": {
          flexGrow: 0,
          flexShrink: 1,
        },
      },
      media: {},
    },
  ],
  [
    "flex-none",
    {
      styles: {
        "flex-none": {
          flexGrow: 0,
          flexShrink: 0,
        },
      },
      media: {},
    },
  ],
]);
