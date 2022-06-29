import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Masks", [
  [
    "ios:w-screen", // Has mask, atRules & topics
    {
      styles: {
        "ios:w-screen": { width: 100 },
      },
      units: {
        "ios:w-screen": { width: "vw" },
      },
      masks: {
        "ios:w-screen": 8192,
      },
      topics: {
        "ios:w-screen": ["width"],
      },
    },
  ],
]);
