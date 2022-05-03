import { expectError, tailwindRunner } from "./runner";

tailwindRunner("Interactivity - Scroll Snap Type", [
  ...expectError(["snap-none", "snap-x", "snap-y", "snap-both"]),
  ["snap-mandatory", { styles: {} }],
  ["snap-proximity", { styles: {} }],
]);
