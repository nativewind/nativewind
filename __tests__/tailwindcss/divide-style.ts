import { expectError, tailwindRunner } from "./runner";

const scenarios = ["solid", "dashed", "dotted", "double", "none"];

tailwindRunner("Border - Divide Style", [
  ...expectError(scenarios.map((n) => `divide-${n}`)),
]);
