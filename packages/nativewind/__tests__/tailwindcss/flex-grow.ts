import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Grow", [
  ["grow", { styles: { grow: { flexGrow: 1 } } }],
  ["grow-0", { styles: { "grow-0": { flexGrow: 0 } } }],
  ["grow-[2]", { styles: { "grow-[2]": { flexGrow: 2 } } }],
]);
