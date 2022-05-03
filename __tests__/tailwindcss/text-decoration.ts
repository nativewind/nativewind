import { expectError, tailwindRunner } from "./runner";

tailwindRunner("Typography - Text Decoration", [
  ["underline", { styles: { underline: { textDecorationLine: "underline" } } }],
  [
    "line-through",
    { styles: { "line-through": { textDecorationLine: "line-through" } } },
  ],
  [
    "no-underline",
    { styles: { "no-underline": { textDecorationLine: "none" } } },
  ],
  ...expectError(["overline"]),
]);
