import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Grow", [
  ["grow", { grow: [{ flexGrow: 1 }] }],
  ["grow-0", { "grow-0": [{ flexGrow: 0 }] }],
  ["grow-[1]", { "grow-_1_": [{ flexGrow: 1 }] }],
]);
