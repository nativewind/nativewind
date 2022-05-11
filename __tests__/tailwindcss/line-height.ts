import { TextStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["letterSpacing"]> = {
  3: 12,
  4: 16,
};

tailwindRunner(
  "Typography - Line Height",
  createTests("leading", scenarios, (n) => ({ lineHeight: n })),
  expectError([
    "leading-none",
    "leading-tight",
    "leading-snug",
    "leading-normal",
    "leading-relaxed",
    "leading-loose",
  ])
);
