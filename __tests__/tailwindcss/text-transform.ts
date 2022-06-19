import { tailwindRunner } from "./runner";

tailwindRunner("Typography - Text Transform", [
  ["uppercase", { styles: { uppercase: { textTransform: "uppercase" } } }],
  ["lowercase", { styles: { lowercase: { textTransform: "lowercase" } } }],
  ["capitalize", { styles: { capitalize: { textTransform: "capitalize" } } }],
  ["normal-case", { styles: { "normal-case": { textTransform: "none" } } }],
]);
