import { tailwindRunner, expectError, $ } from "./runner";

tailwindRunner(
  "Layout - Overflow",
  expectError([
    "overflow-auto",
    "overflow-clip",
    "overflow-x-auto",
    "overflow-y-auto",
    "overflow-x-hidden",
    "overflow-y-hidden",
    "overflow-x-clip",
    "overflow-y-clip",
    "overflow-x-visible",
    "overflow-y-visible",
    "overflow-x-scroll",
    "overflow-y-scroll",
  ]),
  [
    ["overflow-hidden", { [$`overflow-hidden`()]: [{ overflow: "hidden" }] }],
    [
      "overflow-visible",
      { [$`overflow-visible`()]: [{ overflow: "visible" }] },
    ],
    ["overflow-scroll", { [$`overflow-scroll`()]: [{ overflow: "scroll" }] }],
  ]
);
