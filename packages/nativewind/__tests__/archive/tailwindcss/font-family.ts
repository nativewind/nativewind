import { tailwindRunner } from "./runner";

tailwindRunner("Typography - Font Family", [
  ["font-sans", { styles: { "font-sans": { fontFamily: "ui-sans-serif" } } }],
  ["font-serif", { styles: { "font-serif": { fontFamily: "ui-serif" } } }],
  ["font-mono", { styles: { "font-mono": { fontFamily: "ui-monospace" } } }],
]);
