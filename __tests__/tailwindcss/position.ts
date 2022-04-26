import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner("Layout - Object Position", [
  ...emptyResults(["fixed", "sticky"]),
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
  [
    "static",
    {
      styles: {
        static: { position: undefined },
      },
      media: {},
    },
  ],
]);
