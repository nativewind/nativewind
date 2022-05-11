import { createTests, expectError, tailwindRunner } from "./runner";

const scenarios: Record<string, string> = {
  transparent: "transparent",
  black: "rgba(0, 0, 0, 1)",
  white: "rgba(255, 255, 255, 1)",
  "slate-50": "rgba(248, 250, 252, 1)",
  "gray-50": "rgba(249, 250, 251, 1)",
  "zinc-50": "rgba(250, 250, 250, 1)",
  "neutral-50": "rgba(250, 250, 250, 1)",
  "stone-50": "rgba(250, 250, 249, 1)",
  "red-50": "rgba(254, 242, 242, 1)",
  "orange-50": "rgba(255, 247, 237, 1)",
  "amber-50": "rgba(255, 251, 235, 1)",
  "yellow-50": "rgba(254, 252, 232, 1)",
  "lime-50": "rgba(247, 254, 231, 1)",
  "green-50": "rgba(240, 253, 244, 1)",
  "emerald-50": "rgba(236, 253, 245, 1)",
  "teal-50": "rgba(240, 253, 250, 1)",
  "cyan-50": "rgba(236, 254, 255, 1)",
  "sky-50": "rgba(240, 249, 255, 1)",
  "blue-50": "rgba(239, 246, 255, 1)",
  "indigo-50": "rgba(238, 242, 255, 1)",
  "violet-50": "rgba(245, 243, 255, 1)",
  "purple-50": "rgba(250, 245, 255, 1)",
  "fuchsia-50": "rgba(253, 244, 255, 1)",
  "pink-50": "rgba(253, 242, 248, 1)",
  "rose-50": "rgba(255, 241, 242, 1)",
};

tailwindRunner(
  "Border - Border Color",
  createTests("border", scenarios, (n) => ({
    borderBottomColor: n,
    borderRightColor: n,
    borderTopColor: n,
    borderLeftColor: n,
  })),
  createTests("border-x", scenarios, (n) => ({
    borderRightColor: n,
    borderLeftColor: n,
  })),
  createTests("border-y", scenarios, (n) => ({
    borderBottomColor: n,
    borderTopColor: n,
  })),
  createTests("border-t", scenarios, (n) => ({
    borderTopColor: n,
  })),
  createTests("border-b", scenarios, (n) => ({
    borderBottomColor: n,
  })),
  createTests("border-l", scenarios, (n) => ({
    borderLeftColor: n,
  })),
  createTests("border-r", scenarios, (n) => ({
    borderRightColor: n,
  })),
  expectError([
    "border-current",
    "border-inherit",
    "border-x-current",
    "border-x-inherit",
    "border-y-current",
    "border-y-inherit",
    "border-t-current",
    "border-t-inherit",
    "border-b-current",
    "border-b-inherit",
    "border-l-current",
    "border-l-inherit",
    "border-r-current",
    "border-r-inherit",
  ])
);
