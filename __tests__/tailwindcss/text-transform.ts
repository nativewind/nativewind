import { tailwindRunner } from "./runner";

tailwindRunner("Typography - Text Transform", [
  ["uppercase", { uppercase: [{ textTransform: "uppercase" }] }],
  ["lowercase", { lowercase: [{ textTransform: "lowercase" }] }],
  ["capitalize", { capitalize: [{ textTransform: "capitalize" }] }],
  ["normal-case", { "normal-case": [{ textTransform: "none" }] }],
]);
