import { tailwindRunner, expectError, $ } from "./runner";

tailwindRunner(
  "Layout - Position",
  expectError(["fixed", "sticky"]),
  // static is a special scenario see to-react-native/properties/position.ts
  [
    ["static", {}],
    ["absolute", { [$`absolute`()]: [{ position: "absolute" }] }],
    ["relative", { [$`relative`()]: [{ position: "relative" }] }],
  ]
);
