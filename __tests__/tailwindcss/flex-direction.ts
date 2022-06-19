import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Direction", [
  ["flex-row", { styles: { "flex-row": { flexDirection: "row" } } }],
  ["flex-col", { styles: { "flex-col": { flexDirection: "column" } } }],
  [
    "flex-row-reverse",
    { styles: { "flex-row-reverse": { flexDirection: "row-reverse" } } },
  ],
  [
    "flex-col-reverse",
    { styles: { "flex-col-reverse": { flexDirection: "column-reverse" } } },
  ],
]);
