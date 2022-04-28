import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner("Layout - Object Position", [
  ...emptyResults([
    "overflow-auto",
    "overflow-clip",
    "overflow-x-auto",
    "overflow-y-auto",
    "overflow-x-hidden",
    "overflow-y-hidden",
    "overflow-x-clip",
    "overflow-y-clip",
    "overflow-x-visible",
    "overflow-y-visible",
    "overflow-x-scroll",
    "overflow-y-scroll",
  ]),
  [
    "overflow-hidden",
    {
      styles: {
        "overflow-hidden": { overflow: "hidden" },
      },
    },
  ],
  [
    "overflow-visible",
    {
      styles: {
        "overflow-visible": { overflow: "visible" },
      },
    },
  ],
  [
    "overflow-scroll",
    {
      styles: {
        "overflow-scroll": { overflow: "scroll" },
      },
    },
  ],
]);
