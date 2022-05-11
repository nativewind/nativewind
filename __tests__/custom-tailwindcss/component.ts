import { tailwindRunner } from "../tailwindcss/runner";

tailwindRunner("Custom Tailwind CSS - component", [
  [
    "component-hover:text-green-500",
    {
      "component-hover_text-green-500": [
        { atRules: [["component", "hover"]], color: "#22c55e" },
      ],
    },
  ],
]);
