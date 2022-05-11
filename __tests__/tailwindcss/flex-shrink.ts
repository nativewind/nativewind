import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Shrink", [
  ["shrink", { shrink: [{ flexShrink: 1 }] }],
  ["shrink-0", { "shrink-0": [{ flexShrink: 0 }] }],
]);
