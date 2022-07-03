import { ACTIVE, FOCUS, HOVER } from "../../src/utils/selector";
import { tailwindRunner } from "./runner";

tailwindRunner("Pseudo-classes", [
  [
    "hover:text-green-500",
    {
      masks: {
        "hover:text-green-500": HOVER,
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
        "active:text-green-500": ACTIVE,
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
        "focus:text-green-500": FOCUS,
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
        "active:focus:text-green-500": ACTIVE | FOCUS,
      },
      styles: {
        "active:focus:text-green-500": {
          color: "#22c55e",
        },
      },
    },
  ],
]);
