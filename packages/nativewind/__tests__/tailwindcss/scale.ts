import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Scale", [
  [
    "scale-0",
    {
      styles: { "scale-0": { transform: [{ scaleY: 0 }, { scaleX: 0 }] } },
      transforms: { "scale-0": true },
    },
  ],
  [
    "scale-50",
    {
      styles: { "scale-50": { transform: [{ scaleY: 0.5 }, { scaleX: 0.5 }] } },
      transforms: { "scale-50": true },
    },
  ],
  [
    "scale-x-50",
    {
      styles: { "scale-x-50": { transform: [{ scaleX: 0.5 }] } },
      transforms: { "scale-x-50": true },
    },
  ],
  [
    "scale-y-50",
    {
      styles: { "scale-y-50": { transform: [{ scaleY: 0.5 }] } },
      transforms: { "scale-y-50": true },
    },
  ],
]);
