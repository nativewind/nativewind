import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex", [
  ["flex", { styles: { flex: { display: "flex" } } }],
  [
    "flex-auto",
    {
      styles: {
        "flex-auto": { flexBasis: "auto", flexGrow: 1, flexShrink: 1 },
      },
    },
  ],
  [
    "flex-initial",
    {
      styles: {
        "flex-initial": { flexBasis: "auto", flexGrow: 0, flexShrink: 1 },
      },
    },
  ],
  [
    "flex-none",
    {
      styles: {
        "flex-none": { flexBasis: "auto", flexGrow: 0, flexShrink: 0 },
      },
    },
  ],
]);
