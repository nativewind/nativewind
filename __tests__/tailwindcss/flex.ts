import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex", [
  ["flex", { flex: [{ display: "flex" }] }],
  ["flex-auto", { "flex-auto": [{ flexGrow: 1, flexShrink: 1 }] }],
  ["flex-initial", { "flex-initial": [{ flexGrow: 0, flexShrink: 1 }] }],
  ["flex-none", { "flex-none": [{ flexGrow: 0, flexShrink: 0 }] }],
]);
