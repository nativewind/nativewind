import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Margin", [
  [
    "my-8",
    {
      styles: {
        "my-8": { marginBottom: 32, marginTop: 32 },
      },
      media: {},
    },
  ],
]);
