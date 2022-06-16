import { tailwindRunner, $ } from "./runner";

tailwindRunner("Typography - Font Family", [
  ["font-sans", { [$`font-sans`()]: [{ fontFamily: "ui-sans-serif" }] }],
  ["font-serif", { [$`font-serif`()]: [{ fontFamily: "ui-serif" }] }],
  ["font-mono", { [$`font-mono`()]: [{ fontFamily: "ui-monospace" }] }],
]);
