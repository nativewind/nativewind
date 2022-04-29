import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["aspectRatio"]> = {
  square: 1,
  video: 1.777_777_778,
};

tailwindRunner("Layout - Aspect Ratio", [
  ...createTests("aspect", scenarios, (n) => ({ aspectRatio: n })),
  ["aspect-auto", { styles: {} }],
  [
    "aspect-[4/3]",
    { styles: { "aspect-_4_3_": { aspectRatio: 1.333_333_333_333_333_3 } } },
  ],
]);
