import { tailwindRunner } from "./runner";

tailwindRunner("Pseudo-classes", [
  [
    "hover:text-green-500",
    {
      masks: {
        "hover:text-green-500": 1,
      },
      styles: {
        "hover:text-green-500": {
          color: "#22c55e",
        },
      },
    },
  ],
  [
    "active:text-green-500",
    {
      masks: {
        "active:text-green-500": 2,
      },
      styles: {
        "active:text-green-500": {
          color: "#22c55e",
        },
      },
    },
  ],
  [
    "focus:text-green-500",
    {
      masks: {
        "focus:text-green-500": 4,
      },
      styles: {
        "focus:text-green-500": {
          color: "#22c55e",
        },
      },
    },
  ],
  [
    "active:focus:text-green-500",
    {
      masks: {
        "active:focus:text-green-500": 6,
      },
      styles: {
        "active:focus:text-green-500": {
          color: "#22c55e",
        },
      },
    },
  ],
]);
