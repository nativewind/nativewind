import { TextStyle } from "react-native";
import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, TextStyle["alignContent"]> = {
  center: "center",
  start: "flex-start",
  end: "flex-end",
  between: "space-between",
  around: "space-around",
};

tailwindRunner(
  "Layout - Align Content",
  createTests("content", scenarios, (n) => ({ alignContent: n })),
  expectError(["content-evenly"])
);
