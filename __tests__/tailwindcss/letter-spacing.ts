import { tailwindRunner } from "./runner";

tailwindRunner("Typography - Letter Spacing", [
  [
    "tracking-wide",
    {
      styles: {
        "tracking-wide": { letterSpacing: 0.25 },
      },
      media: {},
    },
  ],
]);
