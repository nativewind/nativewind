import { createTests, tailwindRunner, spacing } from "./runner";

tailwindRunner(
  "Layout - Top Right Bottom Left",
  createTests("p", spacing, (n) => ({
    paddingBottom: n,
    paddingLeft: n,
    paddingRight: n,
    paddingTop: n,
  })),

  createTests("px", spacing, (n) => ({
    paddingLeft: n,
    paddingRight: n,
  })),

  createTests("py", spacing, (n) => ({
    paddingTop: n,
    paddingBottom: n,
  })),

  createTests("pt", spacing, (n) => ({
    paddingTop: n,
  })),

  createTests("pr", spacing, (n) => ({
    paddingRight: n,
  })),

  createTests("pb", spacing, (n) => ({
    paddingBottom: n,
  })),

  createTests("pl", spacing, (n) => ({
    paddingLeft: n,
  }))
);
