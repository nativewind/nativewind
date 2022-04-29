import { TextStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const options: Record<string, TextStyle["justifyContent"]> = {
  start: "flex-start",
  end: "flex-end",
  center: "center",
  between: "space-between",
  around: "space-around",
  evenly: "space-evenly",
};

tailwindRunner(
  "Layout - Justify Content",
  createTests("justify", options, (n) => ({ justifyContent: n }))
);
