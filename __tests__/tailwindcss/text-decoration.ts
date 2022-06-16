import { expectError, tailwindRunner, $ } from "./runner";

tailwindRunner(
  "Typography - Text Decoration",
  [
    ["underline", { [$`underline`()]: [{ textDecorationLine: "underline" }] }],
    [
      "line-through",
      { [$`line-through`()]: [{ textDecorationLine: "line-through" }] },
    ],
    ["no-underline", { [$`no-underline`()]: [{ textDecorationLine: "none" }] }],
  ],
  expectError(["overline"])
);
