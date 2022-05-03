import { expectError, tailwindRunner } from "./runner";

const scenarios = [
  "transparent",
  "black",
  "white",
  "slate-50",
  "gray-50",
  "zinc-50",
  "neutral-50",
  "stone-50",
  "red-50",
  "orange-50",
  "amber-50",
  "yellow-50",
  "lime-50",
  "green-50",
  "emerald-50",
  "teal-50",
  "cyan-50",
  "sky-50",
  "blue-50",
  "indigo-50",
  "violet-50",
  "purple-50",
  "fuchsia-50",
  "pink-50",
  "rose-50",
];

tailwindRunner("Border - Divide Color", [
  ...expectError(scenarios.map((n) => `divide-${n}`)),
]);
