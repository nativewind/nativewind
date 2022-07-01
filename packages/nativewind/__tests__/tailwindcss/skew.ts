import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Skew", [
  ["skew-x-0", { styles: { "skew-x-0": { transform: [{ skewX: "0deg" }] } } }],
  ["skew-y-0", { styles: { "skew-y-0": { transform: [{ skewY: "0deg" }] } } }],
  ["skew-x-1", { styles: { "skew-x-1": { transform: [{ skewX: "1deg" }] } } }],
  ["skew-y-1", { styles: { "skew-y-1": { transform: [{ skewY: "1deg" }] } } }],
]);
