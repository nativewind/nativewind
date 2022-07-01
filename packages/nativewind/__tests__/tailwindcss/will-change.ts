import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Interactivity - Will Change",
  expectError([
    "will-change-auto",
    "will-change-scroll",
    "will-change-contents",
    "will-change-transform",
  ])
);
