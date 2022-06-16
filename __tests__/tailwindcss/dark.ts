import { tailwindRunner, css } from "./runner";

tailwindRunner("Dark mode", [
  [
    "dark:text-green-500",
    {
      [css`dark:text-green-500::dark`]: [{ color: "#22c55e" }],
    },
  ],
]);
