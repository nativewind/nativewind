import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Masks", [
  [
    "ios:w-screen", // Has mask, atRules & topics
    {
      styles: {
        "ios:w-screen@0": { width: 100 },
      },
      atRules: {
        "ios:w-screen": [[["dynamic-style", "vw"]]],
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
