import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Custom Tailwind CSS - Scoped Group", [
  [
    "group-scoped-hover:text-green-500",
    {
      styles: {
        "group-scoped-hover:text-green-500": { color: "#22c55e" },
      },
      masks: {
        "group-scoped-hover:text-green-500": 64,
      },
    },
  ],
]);
