import { DARK_MODE } from "../../src/utils/selector";
import { tailwindRunner } from "./runner";

tailwindRunner("Dark mode", [
  [
    "dark:text-green-500",
    {
      styles: {
        "dark:text-green-500": { color: "#22c55e" },
      },
      masks: {
        "dark:text-green-500": DARK_MODE,
      },
      topics: {
        "dark:text-green-500": ["colorScheme"],
      },
    },
  ],
]);
