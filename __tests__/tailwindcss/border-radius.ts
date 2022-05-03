import { ViewStyle } from "react-native";
import { createTests, tailwindRunner } from "./runner";

const scenarios: Record<string, ViewStyle["borderRadius"]> = {
  none: 0,
  sm: 2,
  md: 6,
  lg: 8,
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
};

tailwindRunner("Border - Border Radius", [
  [
    "rounded",
    {
      styles: {
        rounded: {
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 4,
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        },
      },
    },
  ],
  ...createTests("rounded", scenarios, (n) => ({
    borderBottomLeftRadius: n,
    borderBottomRightRadius: n,
    borderTopLeftRadius: n,
    borderTopRightRadius: n,
  })),
  ...createTests("rounded-t", scenarios, (n) => ({
    borderTopLeftRadius: n,
    borderTopRightRadius: n,
  })),
  ...createTests("rounded-r", scenarios, (n) => ({
    borderBottomRightRadius: n,
    borderTopRightRadius: n,
  })),
  ...createTests("rounded-b", scenarios, (n) => ({
    borderBottomLeftRadius: n,
    borderBottomRightRadius: n,
  })),
  ...createTests("rounded-l", scenarios, (n) => ({
    borderBottomLeftRadius: n,
    borderTopLeftRadius: n,
  })),
  ...createTests("rounded-tl", scenarios, (n) => ({
    borderTopLeftRadius: n,
  })),
  ...createTests("rounded-tr", scenarios, (n) => ({
    borderTopRightRadius: n,
  })),
  ...createTests("rounded-br", scenarios, (n) => ({
    borderBottomRightRadius: n,
  })),
  ...createTests("rounded-bl", scenarios, (n) => ({
    borderBottomLeftRadius: n,
  })),
]);
