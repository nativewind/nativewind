import { tailwindRunner } from "./runner";

tailwindRunner("Typography - Font Style", [
  ["italic", { italic: [{ fontStyle: "italic" }] }],
  ["not-italic", { "not-italic": [{ fontStyle: "normal" }] }],
]);
