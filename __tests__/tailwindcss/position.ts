import { tailwindRunner, emptyResults } from "./runner";

tailwindRunner("Layout - Object Position", [
  ...emptyResults(["fixed", "sticky", "static"]),
  [
    "absolute",
    {
      styles: {
        absolute: { position: "absolute" },
      },
    },
  ],
  [
    "relative",
    {
      styles: {
        relative: { position: "relative" },
      },
    },
  ],
]);
