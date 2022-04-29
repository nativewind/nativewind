import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Flex Wrap", [
  ["flex-wrap", { styles: { "flex-wrap": { flexWrap: "wrap" } } }],
  // prettier-ignore
  ["flex-wrap-reverse", { styles: { "flex-wrap-reverse": { flexWrap: "wrap-reverse" } } } ],
  ["flex-nowrap", { styles: { "flex-nowrap": { flexWrap: "nowrap" } } }],
]);
