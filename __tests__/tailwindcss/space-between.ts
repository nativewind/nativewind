import { emptyResults, tailwindRunner, spacing } from "./runner";

const tests = [
  emptyResults([
    ...Object.keys(spacing).map((space) => `space-x-${space}`),
    ...Object.keys(spacing).map((space) => `space-y-${space}`),
    "space-x-reverse",
    "space-y-reverse",
  ]),
].flat();

tailwindRunner("Layout - Space between", tests);
