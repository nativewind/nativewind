import { tailwindRunner, $ } from "./runner";

tailwindRunner("Layout - Flex Direction", [
  ["flex-row", { [$`flex-row`()]: [{ flexDirection: "row" }] }],
  ["flex-col", { [$`flex-col`()]: [{ flexDirection: "column" }] }],
  [
    "flex-row-reverse",
    { [$`flex-row-reverse`()]: [{ flexDirection: "row-reverse" }] },
  ],
  [
    "flex-col-reverse",
    { [$`flex-col-reverse`()]: [{ flexDirection: "column-reverse" }] },
  ],
]);
