import { expectError, tailwindRunner } from "./runner";

tailwindRunner(
  "Typography - Text Indent",
  expectError([
    "indent-px",
    "indent-0",
    "indent-0.5",
    "indent-1",
    "indent-1.5",
    "indent-96",
  ])
);
