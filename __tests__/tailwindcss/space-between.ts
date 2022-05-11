import { expectError, tailwindRunner, spacing, createTests } from "./runner";

tailwindRunner(
  "Layout - Space between",
  createTests("space-x", spacing, (n) => ({
    atRules: [["selector", "(> * + *)"]],
    marginLeft: n,
  })),
  createTests("space-y", spacing, (n) => ({
    atRules: [["selector", "(> * + *)"]],
    marginTop: n,
  })),
  expectError(["space-x-reverse", "space-y-reverse"])
);
