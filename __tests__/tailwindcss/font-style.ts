import { tailwindRunner } from "./runner";

tailwindRunner("Typography - Font Style", [
  ["italic", { styles: {italic: {fontStyle: "italic"}} }],
  ["not-italic", { styles: { "not-italic": {fontStyle: "normal"}} }],
]);
