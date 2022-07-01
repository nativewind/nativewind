import { tailwindRunner } from "./runner";

tailwindRunner("Dark mode", [
  [
    "dark:text-green-500",
    {
      styles: {
        "dark:text-green-500": { color: "#22c55e" },
      },
      masks: {
        "dark:text-green-500": 131_072,
      },
      topics: {
        "dark:text-green-500": ["colorScheme"],
      },
    },
  ],
]);
