import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Skew", [
  [
    "skew-x-0",
    {
      styles: { "skew-x-0": { transform: [{ skewX: "0deg" }] } },
      transforms: { "skew-x-0": true },
    },
  ],
  [
    "skew-y-0",
    {
      styles: { "skew-y-0": { transform: [{ skewY: "0deg" }] } },
      transforms: { "skew-y-0": true },
    },
  ],
  [
    "skew-x-1",
    {
      styles: { "skew-x-1": { transform: [{ skewX: "1deg" }] } },
      transforms: { "skew-x-1": true },
    },
  ],
  [
    "skew-y-1",
    {
      styles: { "skew-y-1": { transform: [{ skewY: "1deg" }] } },
      transforms: { "skew-y-1": true },
    },
  ],
]);
