import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Scale", [
  [
    "rotate-0",
    {
      styles: { "rotate-0": { transform: [{ rotate: "0deg" }] } },
      transforms: { "rotate-0": true },
    },
  ],
  [
    "rotate-45",
    {
      styles: { "rotate-45": { transform: [{ rotate: "45deg" }] } },
      transforms: { "rotate-45": true },
    },
  ],
]);
