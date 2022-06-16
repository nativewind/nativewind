import { tailwindRunner, $ } from "../tailwindcss/runner";

tailwindRunner("Custom Tailwind CSS - Scoped Group", [
  [
    "group-scoped-hover:text-green-500",
    {
      [$`group-scoped-hover:text-green-500:group-scoped-hover`({
        scopedGroupHover: true,
      })]: [{ color: "#22c55e" }],
    },
  ],
]);
