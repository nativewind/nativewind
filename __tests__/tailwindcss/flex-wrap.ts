import { tailwindRunner, $ } from "./runner";

tailwindRunner("Layout - Flex Wrap", [
  ["flex-wrap", { [$`flex-wrap`()]: [{ flexWrap: "wrap" }] }],
  ["flex-nowrap", { [$`flex-nowrap`()]: [{ flexWrap: "nowrap" }] }],
  [
    "flex-wrap-reverse",
    { [$`flex-wrap-reverse`()]: [{ flexWrap: "wrap-reverse" }] },
  ],
]);
