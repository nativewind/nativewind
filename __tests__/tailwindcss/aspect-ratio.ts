import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["aspectRatio"]> = {
  square: 1,
  video: 1.777_777_778,
  "[4/3]": 1.333_333_333_333_333_3,
};

tailwindRunner(
  "Layout - Aspect Ratio",
  createTests("aspect", scenarios, (n) => ({ aspectRatio: n })),
  [["aspect-auto", {}]]
);
