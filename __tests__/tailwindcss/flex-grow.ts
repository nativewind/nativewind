import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Grow", [
  ["grow", { styles: { grow: { flexGrow: 1 } } }],
  ["grow-0", { styles: { "grow-0": { flexGrow: 0 } } }],
  ["grow-[1]", { styles: { "grow-_1_": { flexGrow: 1 } } }],
]);
