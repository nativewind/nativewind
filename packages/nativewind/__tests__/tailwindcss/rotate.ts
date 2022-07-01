import { tailwindRunner } from "./runner";

tailwindRunner("Layout - Scale", [
  ["rotate-0", { styles: { "rotate-0": { transform: [{ rotate: "0deg" }] } } }],
  [
    "rotate-45",
    { styles: { "rotate-45": { transform: [{ rotate: "45deg" }] } } },
  ],
]);
