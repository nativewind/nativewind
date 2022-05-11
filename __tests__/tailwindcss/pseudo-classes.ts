import { tailwindRunner } from "./runner";

tailwindRunner("Pseudo-classes - hover", [
  [
    "hover:text-green-500",
    {
      "hover_text-green-500": [
        { atRules: [["pseudo-class", "hover"]], color: "#22c55e" },
      ],
    },
  ],
  [
    "focus:text-green-500",
    {
      "focus_text-green-500": [
        { atRules: [["pseudo-class", "focus"]], color: "#22c55e" },
      ],
    },
  ],
  [
    "active:text-green-500",
    {
      "active_text-green-500": [
        { atRules: [["pseudo-class", "active"]], color: "#22c55e" },
      ],
    },
  ],
]);
