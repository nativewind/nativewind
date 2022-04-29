import { tailwindRunner } from "./runner";

tailwindRunner("Sizing - Width", [
  ["w-0", { styles: { "w-0": { width: 0 } } }],
  ["w-px", { styles: { "w-px": { width: 1 } } }],
  ["w-1", { styles: { "w-1": { width: 4 } } }],
  ["w-1/2", { styles: { "w-1_2": { width: "50%" } } }],
  // ["w-1/2", { styles: { w_px: { width: "50%" } } }],
  // ["w-auto", { styles: {} }],
  // ["w-full", { styles: { w_px: { width: "100%" } } }],
  // ["w-screen", { styles: {} }],
  // ["w-min", { styles: {} }],
  // ["w-max", { styles: {} }],
  // ["w-fit", { styles: {} }],
]);
