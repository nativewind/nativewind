import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Skew", [
  ["skew-x-0", { "skew-x-0": [{ transform: [{ skewX: "0deg" }] }] }],
  ["skew-y-0", { "skew-y-0": [{ transform: [{ skewY: "0deg" }] }] }],
  ["skew-x-1", { "skew-x-1": [{ transform: [{ skewX: "1deg" }] }] }],
  ["skew-y-1", { "skew-y-1": [{ transform: [{ skewY: "1deg" }] }] }],
]);
