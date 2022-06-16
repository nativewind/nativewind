import { tailwindRunner, css } from "./runner";

tailwindRunner("Pseudo-classes", [
  [
    "hover:text-green-500",
    {
      [css`hover:text-green-500::hover`]: [{ color: "#22c55e" }],
    },
  ],
  [
    "active:text-green-500",
    {
      [css`active:text-green-500::active`]: [{ color: "#22c55e" }],
    },
  ],
  [
    "focus:text-green-500",
    {
      [css`focus:text-green-500::focus`]: [{ color: "#22c55e" }],
    },
  ],
  [
    "active:hover:text-green-500",
    {
      [css`active:hover:text-green-500::hover::active`]: [{ color: "#22c55e" }],
    },
  ],
]);
