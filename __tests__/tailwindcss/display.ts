import { tailwindRunner, expectError } from "./runner";

const displayEmptyResults = [
  "block",
  "inline-block",
  "inline",
  "inline-flex",
  "table",
  "inline-table",
  "table-caption",
  "table-cell",
  "table-column",
  "table-column-group",
  "table-footer-group",
  "table-header-group",
  "table-row-group	",
  "table-row",
  "flow-root",
  "grid",
  "inline-grid",
  "contents",
  "list-item",
];

tailwindRunner("Layout - Display", expectError(displayEmptyResults), [
  ["flex", { styles: { flex: { display: "flex" } } }],
  ["hidden", { styles: { hidden: { display: "none" } } }],
]);
