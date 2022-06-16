import { tailwindRunner, css } from "../tailwindcss/runner";

tailwindRunner("Custom Tailwind CSS - Scoped Group", [
  [
    "group-scoped-hover:text-green-500",
    {
      [css`group-scoped-hover:text-green-500::group-scoped-hover`]: [
        { color: "#22c55e" },
      ],
    },
  ],
]);
