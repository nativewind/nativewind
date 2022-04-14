import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner("Layout - Object Position", [
  ...emptyResults(["static", "fixed", "sticky"]),
  [
    "absolute",
    {
      styles: {
        absolute: { position: "absolute" },
      },
      media: {},
    },
  ],
  [
    "relative",
    {
      styles: {
        relative: { position: "relative" },
      },
      media: {},
    },
  ],
]);
