import { tailwindRunner, $ } from "./runner";

tailwindRunner("Layout - Flex Grow", [
  ["grow", { [$`grow`()]: [{ flexGrow: 1 }] }],
  ["grow-0", { [$`grow-0`()]: [{ flexGrow: 0 }] }],
  ["grow-[2]", { [$`grow-[2]`()]: [{ flexGrow: 2 }] }],
]);
