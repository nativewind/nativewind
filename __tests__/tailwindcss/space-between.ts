import { expectError, tailwindRunner, spacing, createTests } from "./runner";

tailwindRunner("Layout - Space between", [
  ...createTests("space-x", spacing, (n) => ({
    media: ["--general-sibling-combinator"],
    style: {
      marginLeft: n,
    },
  })),
  ...createTests("space-y", spacing, (n) => ({
    media: ["--general-sibling-combinator"],
    style: {
      marginTop: n,
    },
  })),
  ...expectError(["space-x-reverse", "space-y-reverse"]),
]);
