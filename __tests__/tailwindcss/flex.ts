import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex", [
  ["flex", { styles: { flex: { display: "flex" } } }],
  ["flex-auto", { styles: { "flex-auto": { flexGrow: 1, flexShrink: 1 } } }],
  [
    "flex-initial",
    { styles: { "flex-initial": { flexGrow: 0, flexShrink: 1 } } },
  ],
  ["flex-none", { styles: { "flex-none": { flexGrow: 0, flexShrink: 0 } } }],
]);
