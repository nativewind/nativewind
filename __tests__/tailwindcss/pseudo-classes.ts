import { tailwindRunner } from "./runner";

tailwindRunner("Pseudo-classes", [
  [
    "hover:text-green-500",
    {
      "hover:text-green-500:hover.1": [{ color: "#22c55e" }],
    },
  ],
  [
    "active:text-green-500",
    {
      "active:text-green-500:active.2": [{ color: "#22c55e" }],
    },
  ],
  [
    "focus:text-green-500",
    {
      "focus:text-green-500:focus.4": [{ color: "#22c55e" }],
    },
  ],
  [
    "active:hover:text-green-500",
    {
      "active:hover:text-green-500:hover:active.3": [{ color: "#22c55e" }],
    },
  ],
]);
